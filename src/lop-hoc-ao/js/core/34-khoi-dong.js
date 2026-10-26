/* ===================== Khởi động ===================== */
import { fresh, load } from './09-du-lieu-demo.js';
import { render } from './13-giao-dien-chung.js';
import { jenny } from './33d-jenny-bieu-cam.js';
{const bj=document.querySelector('.brand .jav');if(bj)bj.outerHTML=jenny(40)}
if(!load())fresh();
render();
