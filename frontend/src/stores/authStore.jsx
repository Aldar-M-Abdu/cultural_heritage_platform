// Note: We haven't seen the original file, so this is an assumed implementation
// Add this to your existing authStore if it contains the login implementation

const login = async (credentials) => {
  // Clear previous errors first
  set({ error: null, isLoading: true });
  
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!response.ok) {
      let errorMessage = data.detail || data.message || 'Login failed';
      
      // Provide more specific error messages
      if (response.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (response.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      throw new Error(errorMessage);
    }
    
    // Handle successful login
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
