export function Avatar({ person = 'amina' }) {
  const palettes = { njeri: ['#805039','#253f43','#d8b055'], sam: ['#ab7451','#253c41','#619b8c'], leah: ['#825038','#342f45','#c78879'], imani: ['#754630','#202f39','#7aaba0'], leo: ['#b58159','#50392e','#d7b76b'], tess: ['#976044','#283443','#ce9385'], noor: ['#95653e','#3e3849','#a695c3'], amina: ['#9b5c41', '#183b43', '#ef8b65'], joel: ['#b97850', '#1d3543', '#e5b74a'], ruth: ['#754732', '#283f53', '#8395d5'], evidence: ['#be825b', '#253d4c', '#71b5a2'] };
  if (!palettes[person]) return <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="39" fill="#f5ead1"/><path d="M24 15h24l11 12v38H24Z" fill="#fffdf4" stroke="#638078" strokeWidth="3"/><path d="M48 15v13h11M31 37h20M31 46h20M31 55h13" fill="none" stroke="#638078" strokeWidth="3" strokeLinecap="round"/></svg>;
  const [skin, hair, shirt] = palettes[person];
  return <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="39" fill="#fff5df"/><path d="M8 80Q11 55 40 56Q69 55 72 80" fill={shirt}/><path d="M28 55h24v12Q40 75 28 67" fill={skin}/><ellipse cx="40" cy="33" rx="21" ry="25" fill={skin}/><path d={person === 'amina' ? 'M18 37Q8 4 39 3Q73 0 62 39L55 18Q34 30 22 22Z' : person === 'ruth' ? 'M19 38Q9 8 29 8Q38 -4 52 6Q76 6 61 39L56 20Q35 17 24 24Z' : 'M19 26Q16 3 40 7Q66 4 61 29L53 18L22 24Z'} fill={hair}/><circle cx="32" cy="33" r="2.2" fill="#192d34"/><circle cx="48" cy="33" r="2.2" fill="#192d34"/><path d="M34 45Q40 50 47 44" fill="none" stroke="#fff3e5" strokeWidth="2.5" strokeLinecap="round"/>{person === 'ruth' && <g fill="none" stroke="#dfc480" strokeWidth="2"><rect x="24" y="27" width="13" height="11" rx="4"/><rect x="43" y="27" width="13" height="11" rx="4"/><path d="M37 31h6"/></g>}</svg>;
}
function Tree({ x, y, small = false }) {
  return <g transform={`translate(${x} ${y}) scale(${small ? .65 : 1})`}><ellipse cx="0" cy="25" rx="19" ry="8" fill="#1f725c" opacity=".14"/><path d="M0 4v24" stroke="#886044" strokeWidth="6"/><path d="M-18 9Q-28 -6 -10 -20Q3 -36 16 -18Q35 3 13 13Z" fill="#378b62"/><path d="M-13 -10Q-2 -27 12 -16Q23 -1 10 3Q-9 11 -13 -10" fill="#61b877"/></g>;
}
function Building({ x, y, color, roof, type = 'hall' }) {
  return <g transform={`translate(${x} ${y})`}><ellipse cx="0" cy="36" rx="82" ry="20" fill="#286b65" opacity=".14"/><path d="M-57 -31L25 -51L69 -23L-12 -1Z" fill={roof}/><path d="M-57 -31L-12 -1V62L-57 33Z" fill={color}/><path d="M-12 -1L69 -23V40L-12 62Z" fill="#fff0cc"/><path d="M-12 -1L69 -23V-15L-12 7Z" fill="#e0cc9e"/><path d="M15 16L34 11V50L15 56Z" fill="#276476"/><path d="M43 9L58 5V20L43 24Z" fill="#81cdd6"/><path d="M-43 -9L-25 3V20L-43 9Z" fill="#aedbe0"/>{type === 'studio' ? <g><path d="M-35 -42L15 -54L44 -36L-7 -23Z" fill="#285d80"/><path d="M-22 -44L4 -28M-8 -48L18 -31M7 -52L32 -35M-29 -36L28 -47" stroke="#8dc8db" strokeWidth="1.5"/></g> : <path d="M-57 -31L-16 -68L69 -23L25 -51Z" fill={roof}/>}</g>;
}
export default function OpenPathArt({ selectedIndex = -1, changed = false }) {
  const endpoints = [[200, 223], [443, 167], [648, 272]];
  const target = endpoints[selectedIndex];
  return <svg className="op-map-art" viewBox="0 0 840 490" aria-hidden="true">
    <defs><linearGradient id="op-water" x2="0" y2="1"><stop stopColor="#d7f2ee"/><stop offset="1" stopColor="#a6dfdf"/></linearGradient><linearGradient id="op-land" x2="0" y2="1"><stop stopColor="#e4efbe"/><stop offset="1" stopColor="#bedc9a"/></linearGradient></defs>
    <rect width="840" height="490" rx="30" fill="url(#op-water)"/>
    <g fill="none" stroke="#fff" opacity=".55" strokeWidth="2"><path d="M20 380q45 -12 90 0m590 30q50 -13 100 0M650 50q45 -8 90 0M25 80q40 -10 80 0"/><path d="M30 397q45 -12 90 0m565 30q50 -13 100 0"/></g>
    <path d="M72 135Q74 71 214 70L591 69Q762 76 773 182L772 323Q764 407 622 422L212 415Q63 402 62 316Z" fill="#6eaf8d"/>
    <path d="M72 116Q74 52 214 51L591 50Q762 57 773 163L772 304Q764 388 622 403L212 396Q63 383 62 297Z" fill="url(#op-land)"/>
    <path d="M126 311Q223 278 299 290T480 277T709 318M298 290Q315 208 437 208M531 279Q559 216 653 217M217 291Q190 249 200 220" fill="none" stroke="#d0b880" strokeWidth="29" strokeLinecap="round"/>
    <path d="M126 308Q223 275 299 287T480 274T709 315M298 287Q315 205 437 205M531 276Q559 213 653 214M217 288Q190 246 200 217" fill="none" stroke="#f9e9bf" strokeWidth="22" strokeLinecap="round"/>
    {target && <path className="op-route-draw" key={`${selectedIndex}-${changed}`} d={`M414 370Q362 288 ${target[0]} ${target[1]}`} fill="none" stroke="#d87a3e" strokeWidth="5" strokeDasharray="9 7" strokeLinecap="round"/>}
    <g><path d="M335 355l76 -20l53 31l-76 22Z" fill="#e8ca8d"/><path d="M335 355v15l53 31v-13Z" fill="#c9ac75"/><path d="M388 388v13l76 -21v-14Z" fill="#b49c69"/></g>
    <Building x={200} y={184} color="#ecad75" roof="#db7e54"/>
    <Building x={443} y={128} color="#d3b17c" roof="#809e57"/>
    <Building x={648} y={233} color="#86bdbb" roof="#548ead" type="studio"/>
    {[[115,153],[134,192],[307,132],[332,109],[557,111],[708,128],[734,158],[119,324],[163,356],[256,363],[559,352],[608,358],[690,344]].map(([x,y], i) => <Tree key={i} x={x} y={y} small={i % 3 === 0}/>)}
    <g transform="translate(285 238)"><ellipse cy="21" rx="29" ry="9" fill="#174c5733"/><rect x="-29" y="-5" width="59" height="26" rx="7" fill="#f0c85a"/><rect x="-18" y="0" width="28" height="10" rx="2" fill="#427c8b"/><rect x="14" y="0" width="10" height="10" rx="2" fill="#427c8b"/><circle cx="-17" cy="20" r="6" fill="#294755"/><circle cx="18" cy="20" r="6" fill="#294755"/></g>
    <g fill="#fff9e8" stroke="#baa87e" strokeWidth="2"><path d="M516 339v-30m-18 10h36"/><path d="M511 306h32v13h-32z"/></g>
    <g fill="#e9faf7" opacity=".9"><ellipse cx="106" cy="46" rx="45" ry="10"/><ellipse cx="130" cy="38" rx="27" ry="13"/><ellipse cx="725" cy="53" rx="43" ry="9"/></g>
  </svg>;
}
