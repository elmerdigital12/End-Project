const typeSelect=document.getElementById('typeSelect'),
    pokemonList=document.getElementById('pokemonList'),
    searchInput=document.getElementById('searchInput');
let allPokemon=[];
async function loadTypes(){
    const res=await fetch('https://pokeapi.co/api/v2/type'),
        data=await res.json();
    data.results.forEach(t=>{
        const o=document.createElement('option');
        o.value=t.name;
        o.textContent=t.name.charAt(0).toUpperCase()+t.name.slice(1);
        typeSelect.appendChild(o);
    });
}
async function loadAllPokemon(){
    pokemonList.innerHTML='<p>Loading Site...</p>';
    const res=await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010'),
        data=await res.json();
    const results=data.results;
    allPokemon=[];
    for(let i=0;i<results.length;i+=50){
        const batch=results.slice(i,i+50),
            promises=batch.map(p=>fetch(p.url).then(r=>r.json()));
        allPokemon.push(...await Promise.all(promises));
        displayPokemon(filterAndSearch());
    }
    allPokemon.sort((a,b)=>a.name.localeCompare(b.name));
    displayPokemon(filterAndSearch());
}
function filterAndSearch(){
    const t=typeSelect.value,
        s=searchInput.value.toLowerCase();
    let filtered=allPokemon;
    if(t!=='all') filtered=filtered.filter(p=>p.types.some(x=>x.type.name===t));
    if(s) filtered=filtered.filter(p=>p.name.toLowerCase().includes(s));
    return filtered;
}
function displayPokemon(arr){
    pokemonList.innerHTML='';
    if(!arr.length){pokemonList.innerHTML='<p>No Pokémon found!</p>';return;}
    arr.forEach(p=>{
        const c=document.createElement('article');
        c.className='pokemon-card';
        c.innerHTML=`<h2>${p.name.toUpperCase()}</h2><img src="${p.sprites.front_default}"
alt="${p.name}"><p><strong>Type:</strong> ${p.types.map(t=>t.type.name).join(', ')}</p>
<ul>${p.stats.map(s=>`<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}</ul>`;
        pokemonList.appendChild(c);
    });
}
typeSelect.addEventListener('change',()=>displayPokemon(filterAndSearch()));
searchInput.addEventListener('input',()=>displayPokemon(filterAndSearch()));
loadTypes();
loadAllPokemon();




// f
