import { farRadius } from '../scene/oortField'
import { oortTexts } from '../locales/oort'
import { useLocale } from '../locales/LocaleProvider'
export function DistanceScale() {
 const {locale}=useLocale(),t=oortTexts[locale]
 const ticks=[{au:0,label:'☀',y:35},{au:50,label:'50',y:17},{au:2000,label:'2k',y:35},{au:10000,label:'10k',y:17},{au:100000,label:'100k',y:35}]
 return <figure className="distance-scale"><figcaption>{t.scale}</figcaption><svg viewBox="0 0 340 44" role="img" aria-label="0 · 50 · 2,000 · 10,000 · 100,000 AU"><line x1="12" x2="328" y1="23" y2="23"/>{ticks.map(({au,label,y})=>{const x=12+farRadius(au)/80*316;return <g key={au}><line x1={x} x2={x} y1="20" y2="26"/><text x={x} y={y} textAnchor="middle">{label}</text></g>})}</svg><p>{t.note}</p></figure>
}
