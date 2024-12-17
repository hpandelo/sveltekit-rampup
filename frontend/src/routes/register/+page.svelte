<script lang="ts">
  import { writable } from 'svelte/store';
  import { register, getAvatarUrl } from '$lib';

  let username = '';
  let password = '';
  let passwordConfirm = '';

  const errorMessage = writable('');
  const successMessage = writable('');
  const avatarUrl = writable('');
  const email = writable('');

  let debounceTimeout: number;
  email.subscribe((value) => {
    if (!value) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const url = await getAvatarUrl(value);
      avatarUrl.set(url);
    }, 1000);
  });

  const handleRegister = async () => {
    try {
      if (password !== passwordConfirm) {
        errorMessage.set('Passwords do not match.');
        setTimeout(() => {
          errorMessage.set('');
        }, 3000);
        return;
      }

      const dbUser = await register({ username, email: $email, password, passwordConfirm, avatarUrl: $avatarUrl });
      console.log({ dbUser });

      successMessage.set('Registration successful. Redirecting to login page...');
      setTimeout(() => {
        window.location.href = '/login';
        successMessage.set('');
      }, 3000);

    } catch (error) {
      console.error(error);
      errorMessage.set('Failed to register. Check your details and try again.');
      setTimeout(() => {
        errorMessage.set('');
      }, 3000);
    }
  }
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

  .error-message {
    color: white;
    background-color: rgba(255, 100, 100, 0.8);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 14px;
  }

  .success-message {
    color: white;
    background-color: rgba(100, 200, 100, 0.8);
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 14px;
  }
</style>
<div class="container">
  <div class="form-container">

      <a href="/" class="back-icon" aria-label="Back to Home">
        <i class="fas fa-arrow-left"></i>
      </a>

      <p>Register</p>

      {#if $errorMessage}
        <div class="error-message">{$errorMessage}</div>
      {:else if $successMessage}
        <div class="success-message">{$successMessage}</div>
      {/if}

      {#if $avatarUrl}
        <img src="{$avatarUrl}" alt="User Avatar" style="width: 42px; height: 42px; border-radius: 50%; margin: 10px;" />
      {/if}

      <input
        class="form-input"
        type="text"
        placeholder="Username"
        bind:value={username}
      />
      <input
        class="form-input"
        type="email"
        placeholder="Email"
        bind:value={$email}
      />
      <input
        class="form-input"
        type="password"
        placeholder="Password"
        bind:value={password}
      />
      <input
        class="form-input"
        type="password"
        placeholder="Confirm Password"
        bind:value={passwordConfirm}
      />
      <button class="form-button" on:click={handleRegister} disabled={!username || !email || !password || !passwordConfirm || !!$successMessage}>Register</button>
  </div>
</div>