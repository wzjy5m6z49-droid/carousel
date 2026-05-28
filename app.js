html,
body{
  margin:0;
  padding:0;
  background:transparent;
  font-family:"Segoe UI", sans-serif;
  overflow:hidden;
}

.carouselRoot{
  width:100%;
  opacity:0;
  transform:translateY(18px) scale(.985);
  animation:fadeUp .7s ease forwards;
}

@keyframes fadeUp{
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

.carousel{
  position:relative;
  width:100%;
  aspect-ratio:16 / 9;
  min-height:220px;
  overflow:hidden;
  background:#111;
  border-radius:16px;
}

.slider{
  display:flex;
  width:100%;
  height:100%;
  transition:transform .65s cubic-bezier(.22,.8,.2,1);
}

.slide{
  min-width:100%;
  height:100%;
  position:relative;
  flex-shrink:0;
}

.slide img{
  width:100%;
  height:100%;
  object-fit:contain;
  display:block;
  background:#111;
}

.detailButton{
  position:absolute;
  bottom:20px;
  left:20px;
  z-index:20;

  background:rgba(255,255,255,.88);
  color:#222;
  padding:8px 14px;
  border-radius:8px;
  font-size:14px;
  font-weight:600;
  text-decoration:none;

  transition:.25s ease;
}

.detailButton:hover{
  background:#fff;
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(0,0,0,.25);
}

.arrow{
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  width:72px;
  height:180px;
  border:0;
  background:transparent;
  color:#fff;
  cursor:pointer;
  z-index:50;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:58px;
  line-height:1;
  opacity:.82;
  overflow:hidden;
  transition:.3s ease;
}

.prev{
  left:0;
}

.next{
  right:0;
}

.arrow::before{
  content:"";
  position:absolute;
  inset:0;
  z-index:-1;
  opacity:.8;
}

.prev::before{
  background:linear-gradient(
    to right,
    rgba(0,0,0,.55),
    rgba(0,0,0,.25),
    rgba(0,0,0,0)
  );
}

.next::before{
  background:linear-gradient(
    to left,
    rgba(0,0,0,.55),
    rgba(0,0,0,.25),
    rgba(0,0,0,0)
  );
}

.arrow:hover{
  opacity:1;
  transform:translateY(-50%) scale(1.04);
}

.dots{
  position:absolute;
  bottom:12px;
  left:0;
  right:0;
  z-index:30;

  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
}

.dot{
  width:10px;
  height:10px;
  border-radius:999px;
  background:rgba(255,255,255,.42);
  cursor:pointer;
  transition:.25s ease;
}

.dot:hover{
  transform:scale(1.12);
  background:rgba(255,255,255,.7);
}

.dot.active{
  width:24px;
  background:#fff;
}

.empty{
  width:100%;
  min-width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-size:16px;
}
