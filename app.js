const slider = document.getElementById("slider");
const dots = document.getElementById("dots");
const carousel = document.getElementById("carousel");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const rawItems = window.carouselData || [];

const holidays = (window.holidayData || [])
  .map(item => item && item.HolidayDate)
  .filter(Boolean);

let current = 0;
let timer = null;

const now = new Date();

const today = new Date();
today.setHours(0, 0, 0, 0);

const todayKey = formatDateKey(today);

const isHolidayToday = holidays.indexOf(todayKey) !== -1;

function parseDate(value){
  if(!value){
    return null;
  }

  const d = new Date(value);
  d.setHours(0, 0, 0, 0);

  return d;
}

function formatDateKey(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayKey(){
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
}

function getDisplayDays(item){
  if(!item.DisplayDays){
    return [];
  }

  if(!Array.isArray(item.DisplayDays)){
    return [];
  }

  return item.DisplayDays
    .map(day => day && day.Value)
    .filter(Boolean);
}

function normalizeTime(value){
  if(!value){
    return "";
  }

  const parts = String(value).split(":");

  if(parts.length < 2){
    return "";
  }

  const hour = String(parts[0]).padStart(2, "0");
  const minute = String(parts[1]).padStart(2, "0");

  return `${hour}:${minute}`;
}

function isSameDate(a, b){
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthlyDisplayDate(item){
  const baseDay = Number(item.BaseDay || 0);

  if(!baseDay){
    return null;
  }

  const year = now.getFullYear();
  const month = now.getMonth();

  const target = new Date(year, month, baseDay);
  target.setHours(0, 0, 0, 0);

  if(item.ShiftToFriday === true){
    while(
      target.getDay() === 0 ||
      target.getDay() === 6 ||
      holidays.indexOf(formatDateKey(target)) !== -1
    ){
      target.setDate(target.getDate() - 1);
    }
  }

  return target;
}

function isAllowedBaseDay(item){
  if(!item.BaseDay){
    return true;
  }

  const displayDate = getMonthlyDisplayDate(item);

  if(!displayDate){
    return true;
  }

  return isSameDate(today, displayDate);
}

function isAllowedHoliday(item){
  if(item.HolidayMode === "holiday"){
    return isHolidayToday;
  }

  if(item.HolidayMode === "nonHoliday"){
    return !isHolidayToday;
  }

  return true;
}

function isAllowedTime(item){
  const start = normalizeTime(item.ShowStartTime);
  const end = normalizeTime(item.ShowEndTime);

  if(!start && !end){
    return true;
  }

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hh}:${mm}`;

  if(start && currentTime < start){
    return false;
  }

  if(end && currentTime > end){
    return false;
  }

  return true;
}

function isAllowedDay(item){
  const days = getDisplayDays(item);

  if(!days.length){
    return true;
  }

  return days.indexOf(getTodayKey()) !== -1;
}

function isAllowedDate(item){
  const start = parseDate(item.StartDate);
  const end = parseDate(item.EndDate);

  if(start && today < start){
    return false;
  }

  if(end && today > end){
    return false;
  }

  return true;
}

const items = rawItems
  .filter(item => {
    if(!item || !item.Image){
      return false;
    }

    if(!isAllowedDate(item)){
      return false;
    }

    if(!isAllowedBaseDay(item)){
      return false;
    }

    if(!isAllowedHoliday(item)){
      return false;
    }

    if(!isAllowedDay(item)){
      return false;
    }

    if(!isAllowedTime(item)){
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    const aTime = !!(a.ShowStartTime || a.ShowEndTime);
    const bTime = !!(b.ShowStartTime || b.ShowEndTime);

    if(aTime && !bTime){
      return -1;
    }

    if(!aTime && bTime){
      return 1;
    }

    const aBase = !!a.BaseDay;
    const bBase = !!b.BaseDay;

    if(aBase && !bBase){
      return -1;
    }

    if(!aBase && bBase){
      return 1;
    }

    const orderA = Number(a.DisplayOrder || 9999);
    const orderB = Number(b.DisplayOrder || 9999);

    return orderA - orderB;
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
