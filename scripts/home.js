function createHomeTemplate() {
  const templateString = `
      <style>
      *,
      ::after,
      ::before {
        margin: 0;
        box-sizing: border-box;
        font-size: 18px;
        font-family: Arial, Helvetica, sans-serif;
      }
      body {
        font-family: cursive;
      }
  
      h1 {
        font-size: 50px;
        text-align: center;
      }

      .content {
        background-color: #f1f1f1;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      

      #main-component {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /* min-height: 100vh; */
        flex-grow: 1;
      }

      .background-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        flex-grow: 1;
      }
      .background-container img {
        width: 150px;
      }

      .header-text {
        margin: 0 40px;
        text-align: center;
        text-shadow: 3px 1px 1px #0000004f;
      }

      header {
        background-color: #333;
        text-align: center;
        padding: 50px 0;
        color: #fff;
      }

      header h1 {
        font-size: 36px;
        margin: 0;
      }

      header p {
        font-size: 18px;
        margin: 20px 0;
      }

      .features {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: space-around;
        padding: 50px 0;
        font-style: normal;
        flex-grow: 1;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .feature {
        text-align: center;
        max-width: 300px;
        margin-bottom: 30px;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0px 0px 2px 0px black;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
      }

      .feature img {
        width: 150px;
      }

      .feature h2 {
        font-size: 24px;
        margin: 20px 0;
      }

      .feature p {
        font-size: 16px;
        color: #666;
      }

      footer {
        background-color: #333;
        padding: 20px;
        text-align: center;
        color: #fff;
        font-family: Arial, sans-serif;
        flex-grow: 1;
      }

      @media (max-width: 600px) {
        .background-container img{
            display: none;
          }
      }
    </style>
  
      <div id="main-component">
        <div class="background-container">
          <img src="../assets/images/music-notes.png" />
          <h1 class="header-text">ASCII Chords</h1>
          <img src="../assets/images/music-notes.png" />
        </div>
        <section class="features">
          <div class="feature">
            <img
              src="../assets/images/learning.png"
              alt="Learn Chords"
            />
            <h2>Learn Chords</h2>
            <p>
              Explore a wide variety of chords and learn their representation
              on the staff.
            </p>
          </div>

          <div class="feature">
            <img
              src="../assets/images/headphones.png"
              alt="Play Chords"
            />
            <h2>Play Chords</h2>
            <p>
              Hear the sound of each chord and strum along with the help of
              interactive audio playback.
            </p>
          </div>

          <div class="feature">
            <img
              src="../assets/images/create.png"
              alt="Create Chords"
            />
            <h2>Create Chords</h2>
            <p>
              Compose your own chord progressions and melodies using the ASCII
              chord editor.
            </p>
          </div>
        </section>

        <footer>
          <p>&copy; 2023 ASCII Chords. All rights reserved.</p>
        </footer>
      </div>
        </div>

    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const userProfileTemplate = createHomeTemplate();

class Home extends HTMLElement {
  #_shadowRoot = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(userProfileTemplate.content.cloneNode(true));
  }

  connectedCallback() {}
}

customElements.define("home-container", Home);
