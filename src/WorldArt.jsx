import OpenPathArt from './OpenPathArt';

function Desk({ x, y, colour = '#ddaf71' }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-34 0v35m68-35v35" stroke="#586775" strokeWidth="6"/><path d="M-45 -10l65-16 35 23-66 18Z" fill={colour} stroke="#83664e" strokeWidth="2"/><path d="M-45 -10v9l34 23v-7m66-18v9L-11 22" fill="#c89456"/></g>;
}
export default function WorldArt({ world, selectedIndex, changed }) {
  if (world === 0) return <OpenPathArt selectedIndex={selectedIndex} changed={changed}/>;
  const finance = world === 1;
  const destinations = [[195, 240], [440, 180], [650, 285]];
  const target = destinations[selectedIndex];
  return <svg className="op-map-art" viewBox="0 0 840 490" aria-hidden="true">
    <rect width="840" height="490" rx="30" fill={finance ? '#e6edf1' : '#eee8f4'}/>
    <path d="M45 363L157 112 579 66 794 283 686 426 257 451Z" fill={finance ? '#efe0bf' : '#e1dded'} stroke="#fff8eb" strokeWidth="9"/>
    <path d="M121 330L238 382 678 350M350 131L394 370" stroke="#fff9ee" strokeWidth="28" fill="none"/>
    <path d="M121 330L238 382 678 350M350 131L394 370" stroke="#c1baa5" strokeWidth="2" strokeDasharray="7 8" fill="none"/>
    {finance ? <>
      <g transform="translate(155 210)"><path d="M-60 0L0-60 100-20 80 70-60 45Z" fill="#bc7954"/><path d="M-70 0L0-70 110-25 34 20Z" fill="#466d74"/><path d="M34 20L110-25v85L34 95Z" fill="#f5cda1"/><path d="M52 27l40-23v60L52 87Z" fill="#48636c"/><path d="M-41 18l27 8v25l-27-8Z" fill="#afd8df"/></g>
      <Desk x={426} y={220}/><Desk x={480} y={267}/>
      <g transform="translate(608 303)"><rect width="85" height="43" rx="6" fill="#6ca49c"/><path d="M85 13h30l20 21v24H85Z" fill="#e7b14e"/><path d="M91 18h20l12 15H91Z" fill="#daf2ef"/><circle cx="22" cy="58" r="12" fill="#3d4f58"/><circle cx="105" cy="58" r="12" fill="#3d4f58"/></g>
      <g fill="#c6925c" stroke="#93714e" strokeWidth="2"><path d="M88 315h62v35H88Z"/><path d="M104 285h62v30h-62Z"/></g>
      <text x="125" y="397" fill="#5d665d" fontSize="13">MATERIALS</text><text x="402" y="326" fill="#5d665d" fontSize="13">MAKE & CHECK</text><text x="622" y="403" fill="#5d665d" fontSize="13">DELIVERY</text>
    </> : <>
      <g transform="translate(135 215)"><rect width="115" height="75" rx="9" fill="#fff7e6" stroke="#9b8fb3" strokeWidth="3"/>{[0,1,2].map(i=><g key={i}><rect x={14+i*30} y="15" width="23" height="24" fill={['#e5b66b','#9ecac1','#caacd8'][i]}/><path d={`M${17+i*30} 52h18`} stroke="#a698b6" strokeWidth="3"/></g>)}<path d="M15 75v20m85-20v20" stroke="#887d98" strokeWidth="5"/></g>
      <Desk x={435} y={235} colour="#b6a4d6"/><path d="M410 203v-43h53v43Z" fill="#466675"/><path d="M415 165h43v31h-43Z" fill="#c9e3df"/>
      <g transform="translate(620 305)"><ellipse rx="68" ry="27" fill="#b5a6c8"/><ellipse cy="-8" rx="68" ry="27" fill="#fff1c8"/>{[-45,0,45].map((x,i)=><g key={x}><circle cx={x} cy={i===1?30:-40} r="13" fill={['#8a573e','#b8805b','#704733'][i]}/><path d={`M${x-16} ${i===1?50:-19}q16-15 32 0`} stroke={['#6a9a91','#d2aa5b','#9183b6'][i]} strokeWidth="15" fill="none"/></g>)}</g>
      <text x="140" y="340" fill="#695c7a" fontSize="13">RESEARCH</text><text x="404" y="298" fill="#695c7a" fontSize="13">CREATE</text><text x="607" y="402" fill="#695c7a" fontSize="13">TEST TOGETHER</text>
    </>}
    <g fill="#83ac86"><circle cx="70" cy="191" r="23"/><circle cx="732" cy="194" r="27"/><circle cx="310" cy="413" r="18"/></g>
    {target && <path className={changed?'op-route-draw':''} d={`M310 390Q400 340 ${target[0]} ${target[1]}`} stroke={finance?'#b97a35':'#8d68af'} strokeWidth="6" strokeDasharray="10 7" strokeLinecap="round" fill="none"/>}
  </svg>;
}
