const wrappper = document.querySelector(".wrapper"),
musicImg = wrappper.querySelector(".img-area img"),
musicName = wrappper.querySelector(".song-details .name"),
musicArtist = wrappper.querySelector(".song-details .artist"),
mainAudio = wrappper.querySelector("#main-audio"),
playPauseBtn = wrappper.querySelector(".play-pause"),
prevBtn = wrappper.querySelector("#prev"),
nextBtn = wrappper.querySelector("#next"),
progressBar = wrappper.querySelector(".progress-bar"),
progressArea = wrappper.querySelector(".progress-area"),
repeatBtn = wrappper.querySelector("#repeat-plist"),
musicList = wrappper.querySelector(".music-list"),
showMoreBtn = wrappper.querySelector("#more-music"),
closeBtn = musicList.querySelector("#close");

//náhodna pesnička pri načítaní stránky
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);


//zavolá funkcie pri načítaní okna
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);  
    playingNow();
})

//načíta hudbu a informacie o nej
function loadMusic(musicIndex){
    musicName.innerText = allMusic[musicIndex - 1].name;
    musicArtist.innerText = allMusic[musicIndex - 1].artist;
    musicImg.src = `images/${allMusic[musicIndex - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[musicIndex - 1].src}.mp3`;
}

//prehrá hudbu
function playMusic(){
    wrappper.classList.add("playing");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pauza
function pauseMusic(){
    wrappper.classList.remove("playing");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}


//ďalšia v poradí
function nextMusic(){
    musicIndex++;
    //if ak musicIndex je väčší ako veľkosť pola, tak hodnota nadobudne 1, prva pesnička sa prehrá
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex)
    playMusic();
    playingNow();
}

//dozadu o 1
function prevMusic(){
    musicIndex--;
    //if ak musicIndex je menej ako 1 tak musicIndex nadobudne hodnotu posledneho prvku v poli, čiže sa pusti posledná pesnička
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex)
    playMusic();
    playingNow();
}

//prehrať/zastaviť
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrappper.classList.contains("playing");
    //if ak je PlayMusic true, zavolá pauseMusic, v opačnom prípade playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//dopredu button event
nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

//dozadu button event
prevBtn.addEventListener("click", ()=>{
    prevMusic();
});


//progress bar pesničky a jeho "update" k danemu času v pešničke
mainAudio.addEventListener("timeupdate", (t)=>{
    const currentTime = t.target.currentTime; //aktualny čas
    const duration = t.target.duration; //celkovy čas
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrappper.querySelector(".current"),
    musicDuration = wrappper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        // update celkoveho času pesničky
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        if (totalSec < 10){
            totalSec = `0${totalSec}`;  //ak je sekund menej ako 10 pridá sa 0 pred čislo
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`; 
    });
    // update aktualneho času pesnicky
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);

    if (currentSec < 10){
        currentSec = `0${currentSec}`;  //ak je sekund menej ako 10 pridá sa 0 pred čislo
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`; 
});

//update aktualneho času hranej pesničky v závislosti na progress bare
progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; //šírka progress baru
    let clickedX = e.offsetX; //offset X
    let songDuration = mainAudio.duration; //celkovy čas pesnicky

    mainAudio.currentTime = (clickedX / progressWidth) * songDuration;
});

//opakovanie 1 pesnicky, opakovanie playlistu a nahodne prehravanie
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Pesnička sa bude opakovať")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Náhodné prehrávanie")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist sa bude opakovať")
            break;
    };
});

//čo sa stane s pesničkou ked dohra k zavislosti ikoniek a case-ov
mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            break;
        case "shuffle":
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1); //generuje nahodne čislo
            do
            {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while(musicIndex == randomIndex); //prebehne pokial sa čislo bude rovnat s musicIndexom, čiže pokial sa vygeneruje ine čislo ako music index tak skončí
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
        }
});

//music playlist sa zobrazi po kliknuti na ikonku
showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

closeBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});


const ulTag = wrappper.querySelector("ul");
//vytvorí li tagy v zavislosti na dlžke pola pre playlist
for (let i = 0; i < allMusic.length; i++) {
//predanie nazvu pesnicky, autora z pola
    let liTag = `<li li-index="${i + 1}">
                     <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;
    
    ulTag.insertAdjacentHTML("beforeend", liTag); //vlozenie li do ul 

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`); 
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`; //predanie celkovej dlzky pesnicky
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);  //pridanie atributu t-duration
    });
}

const allLiTags = ulTag.querySelectorAll("li");
//prehranie niektorej pesnicky z listu ked sa na nu klikne, teda na jej li
function playingNow(){
    for (let i = 0; i < allLiTags.length; i++) {

        let audioTag = allLiTags[i].querySelector(".audio-duration");

        if(allLiTags[i].classList.contains("playing")){
            allLiTags[i].classList.remove("playing");
            let audioDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = audioDuration;
        }
        //ak je li index rovnaky ako musicIndex tak sa prida do class "playing"
        if(allLiTags[i].getAttribute("li-index") == musicIndex){
            allLiTags[i].classList.add("playing");
            audioTag.innerText = "playing";
        }
    
        allLiTags[i].setAttribute("onclick", "clicked(this)");
        
    }
    
}

//kliknutie na li
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updatuje index pesničky kliknutim na li a predanim jej li-indexu
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}




















