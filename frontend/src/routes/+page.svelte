<script>
  import { goto } from '$app/navigation';

  function redirectToLogin() {
    goto('/login');
  }
</script>

<style>
  .landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
    text-align: center;
    color: #333;
    width: 90vw;
  }

  .landing-page h1 {
    font-size: 3em;
    margin-bottom: 20px;
    color: #4a90e2;
  }

  .landing-page p {
    font-size: 1.5em;
    margin-bottom: 40px;
    max-width: 600px;
  }

  .form-button, .form-button-secondary {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .form-button {
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  .form-button-secondary {
    background-color: #FFF;
    border-color: #007bff;
    color: #007bff;
    cursor: pointer;
  }

  .form-button:hover {
    background-color: #0056b3;
  }

  .form-button-secondary:hover {
    background-color: #EEE;
  }

  .button-container {
    width: 60%;
    padding: 10px;
  }
</style>

<div class="landing-page">
  <h1>Welcome to the Chat App</h1>
  <p>Connect with your friends and family instantly. Join our community and start chatting now!</p>
  <div class="button-container">
    <button class="form-button" on:click={redirectToLogin}>Login</button>
    <br />
    <button class="form-button-secondary" on:click={() => window.location.href = '/register'}>Register</button>
  </div>
</div>