// === State ===
/** Number of sheep in starting pasture */
let start = 10;

/** Number of sheep in target pasture */
let target = 0;

/** Number of sheep that have been counted */
let count = 0;

/**
 * Adds `n` sheep to `start`
 * @param {number} n - the number of sheep to add
 */
function addSheep(n) {
  start += n;
  render();
}

/**
 * Moves one sheep from `start` to `target`,
 * but only if there is at least one sheep to move.
 */
function moveSheep() {
  if (start <= 0) return;
  start--;
  target++;
  count++;

  render();
}


// === Components ===
/** Form that allows user to add more sheep to the starting pasture */
function SheepForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Add more sheep to count
      <input name="count" type="number" min="1" />
    </label>
    <button>+</button>
  `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData($form);
    const rawCount = formData.get("count");
    const n = Number(rawCount);


    addSheep(n);
    $form.reset();
  });
  return $form;
}

/**
 * A single Sheep.
 * Clicking on a sheep that is waiting will move it from
 * the starting pasture to the target pasture.
 * @param {boolean} waiting - whether the sheep is waiting to be counted
 */
function Sheep(waiting) {
  const $sheep = document.createElement("p");
  $sheep.classList.add("sheep");
  $sheep.textContent = "🐑";

  if (waiting) {
    $sheep.classList.add("waiting");
    // TODO: add a `click` event listener
    $sheep.addEventListener("click", moveSheep);
    // moveSheep();
  }

  return $sheep;
}

/** Message that indicates how many sheep have been counted so far */
function SheepCount() {
  const $msg = document.createElement("p");
  $msg.classList.add("count");
  $msg.textContent = `You have counted ${count} sheep! =)`;
  return $msg;
  // TODO
}

/**
 * A Pasture contains Sheep.
 * @param {*} n - the number of sheep in this pasture
 * @param {*} waiting - whether the sheep in this pasture are waiting
 */
function Pasture(n, waiting) {
  const $pasture = document.createElement("section");
  $pasture.classList.add("pasture");

  // Note: We use `Array.from` instead of `map` because `n` is a number, not an array.
  const $sheep = Array.from({ length: n }, () => Sheep(waiting));
  $pasture.replaceChildren(...$sheep);

  return $pasture;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Counting Sheep</h1>
    <SheepCount></SheepCount>
    <SheepForm></SheepForm>
    <main>
      <Pasture id="start"></Pasture>
      <figure class="fence">
        <img alt="fence" src="images/fence.png" />
      </figure>
      <Pasture id="target"></Pasture>
    </main>
  `;
  $app.querySelector("SheepForm").replaceWith(SheepForm());
  $app.querySelector("SheepCount").replaceWith(SheepCount());

  // Note: This is an example of how we can reuse the same component
  // to render two different (but similar) elements.
  $app.querySelector("Pasture#start").replaceWith(Pasture(start, true));
  $app.querySelector("Pasture#target").replaceWith(Pasture(target, false));
}
render();
