<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, onMount, tick } from 'svelte';
  import { user } from '../../stores/user';
  import { messages } from '../../stores/messages';
  import { addMessage, getMessages, subscribeToMessages, deleteMessage, logout } from '$lib';
	import { writable } from 'svelte/store';

  export const ssr = false;

  let loading = true;
  let flying = false;
  let message = '';
  let unsubscribe: () => void;
  const totalMessagesFromSSE = writable(0);

  const handleSubmitMessage = async () => {
    flying = true;

    await addMessage({
      user: $user!,
      message: message.replace(/<\/?[^>]+(>|$)/g, "").trim().replace(/\n/g, "<br>"),
      date: new Date(),
    });

    message = '';
    setTimeout(() => {
      flying = false;
      (document.getElementById('message') as HTMLInputElement)?.focus();
    }, 600); // Duration of the animation
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (flying) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage();
    }
  }
  
  const handleLogout = () => {
    user.set(null);
    logout();
    window.location.href = '/login';
  }

  const scrollChatWindowToBottom = () => {
    setTimeout(() => {
      const chatWindow = document.getElementById('chat-window');
      chatWindow?.scrollTo(0, chatWindow.scrollHeight);
    }, 10);
  }

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
  }

  const messagesSubscriptionCallback = async ({ action, record }: { action: string; record: Message; }) => {
    switch (action) {
      case 'create':
        $messages = [...$messages, record];
        break;

      case 'delete':
        $messages = $messages.filter((m) => m.id !== record.id);
        break;
    }

    browser && scrollChatWindowToBottom();
  };

  onMount(async () => {
    user.subscribe((v) => (!v?.username) && handleLogout());

    $messages = await getMessages();
    browser && scrollChatWindowToBottom();

    unsubscribe = await subscribeToMessages(messagesSubscriptionCallback);
    setTimeout(() => (loading = false), 500);

    // SSE
    if (browser) {
      const beUrl = import.meta.env.VITE_BACKEND_URL;
      console.log('If Browser Inside', { beUrl });
      const eventSource = new EventSource(beUrl + '/status');

      // eventSource.addEventListener('room-status', ({ data }) => {
      //   console.log('Event Received', { data });
      //   totalMessagesFromSSE.set(Number(data));
      // });

      eventSource.onopen = () => {
        console.log('Connected to SSE');
      };

      eventSource.onmessage = ({ data }) => {
        console.log('Message Received', { data });
        const totalMessages = JSON.parse(data).totalMessages;
        totalMessagesFromSSE.set(Number(totalMessages));
      };

      eventSource.onerror = () => {
        console.error('Error occurred while connecting to SSE');
        eventSource.close();
      };
    }
  });

  onDestroy(() => {
    unsubscribe && unsubscribe();
  });
</script>

<div style="display: {loading ? 'flex' : 'none'};" class="loading">
  <span class="fas fa-spinner fa-spin"></span>
</div>

<div class="container">
  <div class="chat-container">

    <div id="chat-window" class="chat-window">
      {#each $messages as msg}
        <div class="chat-message">
          <div class="profile">
            <img src="{msg.user!.avatarUrl}" alt="{msg.user.username}'s avatar" />
            <span>{ msg.user.username }</span>
          </div>
          <div class="message-container">
            <div class="output">{@html msg.message}</div>
          </div>
          <div class="message-info">{new Date(msg.date).toLocaleString('pt-BR')}</div>
            {#if msg.user.id === $user?.id}
              <button class="delete" on:click={() => handleDeleteMessage(msg.id)} aria-label="Delete message">
                <i class="fas fa-trash"></i>
              </button>
            {/if}
        </div>
      {/each}
    </div>
    <div style="width: 98%; text-align: right; font-size: 10px; padding: 10px; float: right;">Total Messages (SSE Endpoint) {$totalMessagesFromSSE}</div>

    <div class="profile">
      <img src="{ $user?.avatarUrl }" alt="{$user?.username}'s avatar" />
      <span>{ $user?.username } <small>&lt;{ $user?.email }&gt;</small></span>
      <div style="flex-grow: 1;"></div>
      <button class="logout" on:click={handleLogout}>Logout</button>
    </div>

    <div class="input-container">
      <textarea id="message" class="message" placeholder="Enter your message" on:keypress={handleKeyPress} bind:value={message}></textarea>
      <button class="send" type="button" on:click={handleSubmitMessage} aria-label="Send message" disabled={flying || !$user?.username}>
        <span class="{flying ? 'fly' : ''}">
          <i class="fas fa-paper-plane"></i>
        </span>
      </button>
    </div>

  </div>
</div>

<style>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, .96);
    z-index: 1000;

    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .loading > span {
    color: rgba(100, 100, 160, 0.8);
    font-size: 3em;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 98vh;
    width: 100%;
    margin: 20px;
  }

  .logout {
    padding: 10px 20px;
    background-color: #f00;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .logout:hover {
    background-color: #c00;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
  }

  .chat-window {
    flex: 1 1;
    padding: 20px;
    border: 1px solid #eee;
    overflow-y: scroll;
    height: 100%;
  }

  .output {
    margin-bottom: 10px;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .message-info {
    color: #aaa;
    size: 1em;
  }

  .input-container {
    display: flex;
    border-top: 1px solid #eee;
    padding: 16px;
  }

  .message {
    flex: 1 0 auto;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .send {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #088;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
  }

  .send:hover {
    background-color: #0AA;
  }

  .send:disabled {
    background-color: #1BB;
    cursor: not-allowed;
  }

  .send span {
    display: flex;
    align-items: center;
    transition: transform .3s;
  }

  .send span.fly {
    animation: fly-diagonal .5s forwards, fly-back .3s .3s forwards;
  }

  @keyframes fly-diagonal {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(200px, -200px);
      opacity: 0;
    }
  }

  @keyframes fly-back {
    0% {
      transform: translate(-200px, 200px);
      opacity: 0;
    }
    100% {
      transform: translate(0, 0);
      opacity: 1;
    }
  }

  .profile {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
    padding: 16px;
  }

  .profile img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .profile span {
    font-size: 1em;
  }

  .chat-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    padding: 8px 16px 4px 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .chat-message .profile {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    margin-right: 10px;
    font-weight: bold;
  }

  .chat-message .profile img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .chat-message .message-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .chat-message .output {
    margin-bottom: 5px;
  }

  .chat-message .message-info {
    color: #aaa;
    font-size: 10px;
  }

  .chat-message .delete {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    margin-left: 10px;
  }

  .chat-message .delete:hover {
    color: #f00;
  }
</style>
