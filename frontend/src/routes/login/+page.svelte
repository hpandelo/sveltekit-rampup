<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { user } from '../../stores/user';
	import { login, logout, getAvatarUrl } from '$lib';

  let email = '';
  let password = '';

  const errorMessage = writable('');

  async function handleLogin() {
    try {
      const avatarUrlFallback = await getAvatarUrl(email);
      const dbUser = await login(email, password);

      user.set(dbUser);
      console.log('Logging In', $user);
    } catch (error) {
      console.error(error);
      errorMessage.set('Failed to authenticate. Check your credentials and try again.');
      setTimeout(() => {
        errorMessage.set('');
      }, 3000);
    }
  }

  function handleSignOut() {
    console.log('Logging out', $user);
    logout();
    user.set(null);
  }

  onMount(() => {
    console.log('Logged', $user);

    email = $user?.email || '';

    user.subscribe((v) => {
      const isLoggedIn = v?.username && v?.email;
      isLoggedIn && setTimeout(() => {
        window.location.href = '/chat';
      }, 3000);
    });
  });

</script>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }

  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    width: 400px;
  }

  .form-header {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #333;
  }

  .form-input, .form-button {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .form-input {
    border: 1px solid #ccc;
  }

  .form-button {
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  .form-button:hover {
    background-color: #0056b3;
  }

  .form-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .form-footer {
    text-align: center;
  }

  .sign-out-button {
    background-color: #dc3545;
  }

  .sign-out-button:hover {
    background-color: #c82333;
  }

  .redirecting {
    width: 90%;
    padding: 20px;
    text-align: center;
  }

  .error-message {
    color: white;
    background-color: rgba(255, 100, 100, 0.8);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 14px;
  }
</style>
<div class="container">
  <div class="form-container">

    {#if $user?.username}
      <div class="form-header">Welcome, { $user.username }</div>

      <div class="redirecting">
          <img src="{$user.avatarUrl}" alt="User Avatar" style="width: 42px; height: 42px; border-radius: 50%; margin: 10px;" />
      </div>
      <div class="redirecting">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Redirecting...</p>
      </div>

      <div class="form-footer">
        <button class="form-button" on:click={() => window.location.href = '/chat'}>Start Chatting</button>
        <button class="form-button sign-out-button" on:click={handleSignOut}>Logout</button>
      </div>

    {:else}

      <a href="/" class="back-icon" aria-label="Back to Home">
        <i class="fas fa-arrow-left"></i>
      </a>

      <p>Login</p>

      {#if $errorMessage}
        <div class="error-message">{$errorMessage}</div>
      {/if}

      <input
        class="form-input"
        type="email"
        placeholder="Email"
        bind:value={email}
      />
      <input
        class="form-input"
        type="password"
        placeholder="Password"
        bind:value={password}
      />
      <button class="form-button" on:click={handleLogin} disabled={!password || !email}>Login</button>
    {/if}
  </div>
</div>
