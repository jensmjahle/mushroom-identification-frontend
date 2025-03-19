<template>
    <div class="home-page">
      <h1>Welcome to the Mushroom Identifier</h1>
      
      <input
        v-model="userInput"
        type="text"
        placeholder="Enter something..."
      />
      
      <p>You typed: {{ userInput }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
    data() {
      return {
        userInput: ''
      };
    }
  };
  </script>
  
  <style scoped>
  .home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  
  input {
    padding: 10px;
    margin-top: 20px;
    width: 300px;
    font-size: 16px;
  }
  
  p {
    margin-top: 20px;
    color: #333;
  }
  </style>
  