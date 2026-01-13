/**
 * @typedef Artist
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imageUrl
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2511-FTB-CT-WEB-PT"; 
const RESOURCE = "/artists";
const API = BASE + COHORT + RESOURCE;

// === State ===
let artists = [];
let selectedArtist;

// Small helper: rerender after state changes
function rerender() {
  render();
}

/** Updates state with all artists from the API */
async function getArtists() {
  try {
    const response = await fetch(API);
    const result = await response.json();

    // API shape is usually: { data: [...] }
    artists = result.data;

    rerender();
  } catch (err) {
    console.error("getArtists error:", err);
  }
}

/** Updates state with a single artist from the API */
async function getArtist(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();

    // API shape is usually: { data: { ... } }
    selectedArtist = result.data;

    rerender();
  } catch (err) {
    console.error("getArtist error:", err);
  }
}

// === Components ===

/** Artist name that shows more details about the artist when clicked */
function ArtistListItem(artist) {
  // Required structure:
  // <li><a href="#selected">{artist name}</a></li>

  const li = document.createElement("li");

  const a = document.createElement("a");
  a.href = "#selected";
  a.textContent = artist.name;

  // When clicked, fetch that artist + rerender
  a.addEventListener("click", (event) => {
    // We keep the hash jump to #selected (that’s fine),
    // but we also load the artist details.
    getArtist(artist.id);
  });

  li.appendChild(a);
  return li;
}

/** A list of names of all artists */
function ArtistList() {
  // Required structure:
  // <ul class="lineup"> ... </ul>

  const ul = document.createElement("ul");
  ul.className = "lineup";

  artists.forEach((artist) => {
    ul.appendChild(ArtistListItem(artist));
  });

  return ul;
}

/** Detailed information about the selected artist */
function ArtistDetails() {
  if (!selectedArtist) {
    const p = document.createElement("p");
    p.textContent = "Please select an artist to learn more.";
    return p;
  }

  // Required structure:
  // <section class="artist">
  //   <h3>{artist name} #{artist id}</h3>
  //   <figure>
  //     <img alt="{artist name}" src="{artist imageUrl}" />
  //   </figure>
  //   <p>{artist description}</p>
  // </section>

  const section = document.createElement("section");
  section.className = "artist";

  const h3 = document.createElement("h3");
  h3.textContent = `${selectedArtist.name} #${selectedArtist.id}`;

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.alt = selectedArtist.name;
  img.src = selectedArtist.imageUrl;

  figure.appendChild(img);

  const p = document.createElement("p");
  p.textContent = selectedArtist.description;

  section.append(h3, figure, p);
  return section;
}

// === Render ===
function render() {
  const app = document.querySelector("#app");

  // Keep your “placeholder tags” so we can replace them
  app.innerHTML = `
    <h1>Fullstack Gala</h1>
    <main>
      <section>
        <h2>Lineup</h2>
        <ArtistList></ArtistList>
      </section>
      <section id="selected">
        <h2>Artist Details</h2>
        <ArtistDetails></ArtistDetails>
      </section>
    </main>
  `;

  app.querySelector("ArtistList").replaceWith(ArtistList());
  app.querySelector("ArtistDetails").replaceWith(ArtistDetails());
}

async function init() {
  // getArtists already rerenders after it updates state
  await getArtists();
}

init();
