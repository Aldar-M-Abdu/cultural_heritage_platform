const login = async (credentials) => {
  set({ isLoading: true, error: null });
  
  try {
    // Use the correct endpoint (/token instead of /login) for database token authentication
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Use URLSearchParams to format data as form fields
      // Send email as username since backend expects 'username'
      body: new URLSearchParams({
        'username': credentials.email,
        'password': credentials.password,
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
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
    set({ 
      user: data.user,
      token: data.access_token,
      isAuthenticated: true,
      isLoading: false
    });
    
    return data;
  } catch (err) {
    // If err doesn't have a response property, it's likely a network error
    if (!err.response && !err.message.includes('failed')) {
      set({ 
        error: 'Network error. Please check your connection.', 
        isLoading: false 
      });
      throw new Error('Network error. Please check your connection.');
    }
    
    set({ 
      error: err.message || 'Login failed', 
      isLoading: false 
    });
    throw err;
  }
};
