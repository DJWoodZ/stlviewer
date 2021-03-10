import StlViewer from './stlviewer/StlViewer';
import stl from '../assets/fan.stl';

const div = document.createElement('div');
div.style.width = '500px';
div.style.height = '500px';
div.style.margin = '0 auto';
document.body.appendChild(div);

new StlViewer(stl, div);