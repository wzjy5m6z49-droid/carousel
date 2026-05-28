const slider = document.getElementById("slider");
const dots = document.getElementById("dots");
const carousel = document.getElementById("carousel");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const rawItems = window.carouselData || [];

let current = 0;
let timer = null;

const today = new Date();
today.setHours(0, 0, 0, 0);

function parseDate(value){
  if(!value){
    return null;
  }

  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

const items = rawItems.filter(item => {
  if(!item || !item.Image){
    return false;
  }

  const start = parseDate(item.StartDate);
  const end = parseDate(item.EndDate);

  if(start && today < start){
    return false;
  }

  if(end && today > end){
    return false;
  }

  return true;
});

function render(){
  if(!items.length){
    slider.innerHTML = '<div class="empty">表示対象の画像がありません</div>';
    return;
  }

  slider.innerHTML = "";
  dots.innerHTML = "";

  items.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
      <img src="${item.Image}" alt="">
      ${
        item.Link
          ? `<a class="detailButton" href="${item.Link}" target="_blank" rel="noreferrer">詳しく見る</a>`
          : ""
      }
    `;

    slider.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = "dot" + (index === current ? " active" : "");

    dot.onclick = () => {
      current = index;
      update();
      restart();
    };

    dots.appendChild(dot);
  });

  update();
  restart();
}

function update(){
  slider.style.transform = `translateX(-${current * 100}%)`;

  Array.from(dots.children).forEach((dot, index) => {
    dot.classList.toggle("active", index === current);
  });
}

function next(){
  if(!items.length){
    return;
  }

  current = (current + 1) % items.length;
  update();
}

function prev(){
  if(!items.length){
    return;
  }

  current = current === 0 ? items.length - 1 : current - 1;
  update();
}

function restart(){
  if(timer){
    clearInterval(timer);
  }

  if(items.length <= 1){
    return;
  }

  timer = setInterval(next, 3000);
}

nextButton.onclick = () => {
  next();
  restart();
};

prevButton.onclick = () => {
  prev();
  restart();
};

carousel.addEventListener("mouseenter", () => {
  if(timer){
    clearInterval(timer);
  }
});

carousel.addEventListener("mouseleave", () => {
  restart();
});

render();
