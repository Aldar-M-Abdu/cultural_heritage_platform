const login = (credentials) => {
  set({ isLoading: true, error: null });
  
  return fetch(`${API_BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'username': credentials.email,
      'password': credentials.password,
    }),
    credentials: 'include'
  })
  .then(response => response.json()
    .then(data => {
      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Invalid email or password. Please try again.';
        
        set({ 
          error: errorMessage, 
          isLoading: false 
        });
        
        throw new Error(errorMessage);
      }
      
      // Handle successful login with database token
      localStorage.setItem('token', data.access_token);
      
      // Fetch user data using the token for additional security
      return fetch(`${API_BASE_URL}/api/v1/auth/current-user`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        },
        credentials: 'include'  // Include credentials for cross-origin requests if needed
      })
      .then(userResponse => {
        if (!userResponse.ok) {
          // Clear token if user data fetch fails
          localStorage.removeItem('token');
          const status = userResponse.status;
          if (status === 401) {
            throw new Error('Token authentication failed. Please login again.');
          }
          throw new Error(`Failed to fetch user details (${status})`);
        }
        return userResponse.json();
      })
      .then(userData => {
        // Ensure we have user data before confirming authentication
        if (!userData || !userData.id) {
          localStorage.removeItem('token');
          throw new Error('Invalid user data received');
        }
        
        // Set authentication state
        set({ 
          user: userData,
          token: data.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Add security headers to all future fetch requests
        window.fetchWithAuth = (url, options = {}) => {
          const defaultOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${data.access_token}`
            },
            credentials: 'include'
          };
          return fetch(url, defaultOptions);
        };
        
        console.log('Authentication successful:', { userId: userData.id, tokenPresent: !!data.access_token });
        return { user: userData, token: data.access_token };
      });
    })
  )
  .catch(err => {
    // If err doesn't have a response property, it's likely a network error
    console.error('Login error:', err);
    set({
      error: err.message || 'Network error. Please check your connection.',
      isLoading: false
    });
    throw err;
  });
};
