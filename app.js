const slider = document.getElementById("slider");
const dots = document.getElementById("dots");
const carousel = document.getElementById("carousel");

const rawItems = window.carouselData || [];

let current = 0;
let timer = null;

const items = rawItems.filter(item => item && item.Image);

if(!items.length){
  slider.innerHTML = '<div class="empty">表示対象の画像がありません</div>';
}

items.forEach((item, index) => {
  const slide = document.createElement("div");
  slide.className = "slide";

  slide.innerHTML = `
    ${
      item.Link
        ? `<a href="${item.Link}" target="_blank" rel="noreferrer">
             <img src="${item.Image}" alt="">
           </a>`
        : `<img src="${item.Image}" alt="">`
    }
  `;

  slider.appendChild(slide);

  const dot = document.createElement("span");
  dot.className = "dot" + (index === 0 ? " active" : "");

  dot.onclick = () => {
    current = index;
    update();
    restart();
  };

  dots.appendChild(dot);
});

function update(){
  slider.style.transform =
    `translateX(calc(10% - ${current * 100}%))`;

  Array.from(dots.children).forEach((dot, index) => {
    dot.classList.toggle("active", index === current);
  });

  Array.from(slider.children).forEach((slide, index) => {
    const img = slide.querySelector("img");

    if(index === current){
      slide.style.transform = "scale(1)";
      slide.style.opacity = "1";
      slide.style.filter = "blur(0px)";

      if(img){
        img.style.transform = "scale(1.02)";
      }
    }
    else{
      slide.style.transform = "scale(.86)";
      slide.style.opacity = ".45";
      slide.style.filter = "blur(1px)";

      if(img){
        img.style.transform = "scale(.96)";
      }
    }
  });
}

function next(){
  if(!items.length) return;

  current = (current + 1) % items.length;
  update();
}

function prev(){
  if(!items.length) return;

  current = current === 0 ? items.length - 1 : current - 1;
  update();
}

function restart(){
  if(timer){
    clearInterval(timer);
  }

  if(items.length <= 1) return;

  timer = setInterval(next, 3000);
}

document.getElementById("next").onclick = () => {
  next();
  restart();
};

document.getElementById("prev").onclick = () => {
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

update();
restart();