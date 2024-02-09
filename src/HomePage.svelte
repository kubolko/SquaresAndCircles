<script>
  import { login } from "./logins/login.js";
</script>

<div class="container">
  <div class="background-image"></div>
  <h1 class="header">Welcome to free Jira Retro Tool</h1>
  <p class="subheader">
    Tired of paying for all those expensive tools? This one is just free, for
    now...
  </p>
  <button class="login-button" on:click={login}>
    <span class="google-logo"></span>
    <span class="login-button-text">Log in with Google</span>
  </button>
</div>

<style>

.container {
  display: flex;
  flex-direction: column; /* This makes the flex items stack vertically */
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #4285f4;
  min-height: 100vh;
}

.header, .subheader, .login-button {
  justify-self: start;
}

  .background-image {
  position: absolute;
  top: 50%; /* Position the top edge of the image at the center of the screen */
  left: 50%; /* Position the left edge of the image at the center of the screen */
  background-image: url("/assets/background.jpg");
  background-position: top left;
  border-radius: 20px;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%; /* Make the image take up the full width of the screen */
  height: 100%; /* Make the image take up the full height of the screen */
  transform: translate(-50%, -50%); /* This offsets the image by half its width and height, effectively centering the top left corner of the image */
  z-index: 0;
}
  .header {
    font-size: 2rem;
    text-align: left;
    margin-bottom: 1rem;
    margin-left: 10%;
    z-index: 1;
  }

  .subheader {
    font-size: 1.5rem;
    text-align: left;
    margin-bottom: 2rem;
    margin-left: 10%;
    z-index: 1;
  }

  .login-button {
    display: inline-flex;
    background-color: #4285f4; /* Google blue */
    color: white;
    border: none;
    width: 191px;
    height: 46px;
    border-radius: 2px;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    font-size: 16px;
    margin-left: 10%;
    z-index: 1;
  }

  .google-logo {
    background: url("/assets/google-logo.png") transparent 5px 50% no-repeat;
    display: inline-block;
    vertical-align: middle;
    width: 46px;
    height: 46px;
  }

  .login-button-text {
    display: inline-flex;
    vertical-align: middle;
    padding-left: 42px;
    padding-right: 42px;
    font-family: "Roboto", sans-serif;
    font-size: 13px;
  }
</style>
