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
  .then(response => {
    // First check if response is ok before trying to parse
    if (!response.ok) {
      // Handle specific HTTP status codes with custom messages
      if (response.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (response.status === 403) {
        throw new Error('Your account is locked. Please contact support.');
      } else if (response.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // For other status codes, try to get error details from response
      return response.json()
        .then(data => {
          const errorMessage = data?.detail || data?.message || `Error (${response.status}): ${response.statusText}`;
          throw new Error(errorMessage);
        })
        .catch(err => {
          // If JSON parsing fails, use status text
          if (err instanceof SyntaxError) {
            throw new Error(`Error (${response.status}): ${response.statusText}`);
          }
          throw err; // Re-throw if it's our custom error from above
        });
    }
    
    // For successful response, parse the JSON
    return response.json().catch(err => {
      console.error('Error parsing login response:', err);
      throw new Error('Invalid response from server');
    });
  })
  .then(data => {
    // Validate token from response with improved error handling
    const token = data.access_token || data.token;
    
    if (!token) {
      console.error('No token in response:', data);
      throw new Error('No authentication token received from server');
    }
    
    if (typeof token !== 'string') {
      console.error('Invalid token type:', typeof token);
      throw new Error('Invalid authentication token format');
    }
    
    if (token.length < 10) {
      console.error('Token too short:', token.length);
      throw new Error('Invalid authentication token received');
    }
    
    // Store token in localStorage and in state
    localStorage.setItem('token', token);
    
    // Set token in state before fetching user
    set({ 
      token: token,
      isLoading: true, // Keep loading true while we fetch user data
      error: null
    });
    
    // Fetch user data with the token
    return fetch(`${API_BASE_URL}/api/v1/auth/current-user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(userResponse => {
      if (!userResponse.ok) {
        // Handle user fetch errors with specific messages
        if (userResponse.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please login again.');
        } else if (userResponse.status === 404) {
          localStorage.removeItem('token');
          throw new Error('User account not found.');
        } else if (userResponse.status >= 500) {
          // For server errors, we can still keep the token but report the error
          throw new Error('Error loading user profile. Please try refreshing the page.');
        }
        throw new Error(`Failed to fetch user details (${userResponse.status})`);
      }
      return userResponse.json();
    })
    .then(userData => {
      if (!userData || !userData.id) {
        localStorage.removeItem('token');
        throw new Error('Invalid user data received');
      }
      
      // Set authentication state
      set({ 
        user: userData,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return { user: userData, token: token };
    });
  })
  .catch(err => {
    console.error('Login error:', err);
    
    // Clear authentication state on error
    localStorage.removeItem('token');
    set({ 
      error: err.message || 'An error occurred during login. Please try again.', 
      isLoading: false,
      token: null,
      user: null,
      isAuthenticated: false
    });
    
    throw err;
  });
};
