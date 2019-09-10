/* Demo party player by DrSnuggles 2019

*/

"use strict";

var demoparty = (function (){
  //
  // vars
  //
  var my = {}; // return object
  var data;    // party entries
  var playingTrack = -1;
  var playingStream = -1;
  var audio;
  var content = -1;
  var slideTime = 5000;

  //
  // load libs
  //
  addScript('js/ldr.js', function() {
    LDR.loadURL('style/amiga/style.css', function(dat) {
      addHead('style', dat, function(){
        //
        // prepare body
        // should use an style file
        //
        var tmp = document.createElement("canvas");
        tmp.id = "goniometercanvas";
        document.body.appendChild(tmp);

        var tmp = document.createElement("img");
        tmp.id = "picture";
        document.body.appendChild(tmp);

        tmp = document.createElement("div");
        tmp.id = "position";
        document.body.appendChild(tmp);

        tmp = document.createElement("div");
        tmp.id = "title";
        document.body.appendChild(tmp);

        tmp = document.createElement("div");
        tmp.id = "textbox";
        document.body.appendChild(tmp);

        /*
        tmp = document.createElement("div");
        tmp.id = "debug";
        tmp.innerText = "12345678901234567890123456789012345678901234567890123456789012345678901234567890X";
        document.body.appendChild(tmp);
        */

        tmp = document.createElement("button");
        tmp.id = "nextTrackButton";
        tmp.innerText = "Next Track";
        tmp.onclick = function(){my.playNextTrack();};
        document.body.appendChild(tmp);

        tmp = document.createElement("button");
        tmp.id = "nextStreamButton";
        tmp.innerText = "Next Stream";
        tmp.onclick = function(){my.playNextStream();};
        document.body.appendChild(tmp);

      });

      LDR.loadURL('js/goniometer.js', function(dat) {
        addHead('script', dat);

        LDR.loadURL('com/scriptprocessor_player.js', function(dat) {
          addHead('script', dat);

          LDR.loadURL('com/backend_mpt.js', function(dat) {
            addHead('script', dat);

            LDR.loadURL('data/data.json', function(dat) {
              data = JSON.parse(dat);
              doTrackEnd();

              //setTimeout(contentChanger, slideTime);

            }, 'text');
          }, 'text');
        }, 'text');
      }, 'text');
    }, 'text');
  });

  //
  // init renderloop
  //
  requestAnimationFrame(renderer);

  //
  // internal helper functions
  //
  function addScript(src, cb) { // loadScript (often one of my first functions i call)
    var script = document.createElement("script");
    script.onload = function() {
      cb();
    };
    script.src = src;
    document.head.appendChild(script);
  }
  function addHead(tag, txt, cb) { // maybe move to LDR ??
    var tmp = document.createElement(tag);
    tmp.type = (tag==='script')? 'text/javascript':'text/css';
    //tmp.text = txt; // works for script only
    tmp.appendChild(document.createTextNode(txt)); // works for script and style
    document.body.appendChild(tmp);
    if (cb) cb();
  }
  function playTrack(id) {
    playingTrack = id;
    var song = 'data/a/tracked/'+data.a.tracked[playingTrack];
    title.innerText = song.substr(song.lastIndexOf("/")+1);
    // check if we have a mp3/ogg fallback here
    var ext = song.substr(song.lastIndexOf(".")+1).toLowerCase();
    if (ext === "mp3" || ext === "ogg") {
      // fallback if web players are not available (e.g. ReNoise)
      audio = new Audio(song);
      ScriptNodePlayer.getInstance().pause();
      audio.play();
      audio.addEventListener("ended", fallbackAudioEnd);
      Goniometer.stop();
      Goniometer.start(audio, goniometercanvas);
    } else {
      try {
        audio.pause();
        audio.removeEventListener("ended", fallbackAudioEnd);
      }catch(e){}
      ScriptNodePlayer.createInstance(new MPTBackendAdapter(), "", [], false, function(){}, function(){}, doTrackEnd); // backendAdapter, basePath, requiredFiles, enableSpectrum, onPlayerReady, onTrackReadyToPlay, onTrackEnd, doOnUpdate, externalTicker
      ScriptNodePlayer.getInstance().loadMusicFromURL(song, {}, function(){}, function(){}, function(){}); // url, options, onCompletion, onFail, onProgress
      Goniometer.stop(audio);
      Goniometer.start(ScriptNodePlayer.getInstance()._gainNode, goniometercanvas);
    }
  }
  function playStream(id) {
    playingStream = id;
    var song = 'data/a/streams/'+data.a.streams[playingStream];
    title.innerText = song.substr(song.lastIndexOf("/")+1);
    audio = new Audio(song);
    ScriptNodePlayer.getInstance().pause();
    audio.play();
    audio.addEventListener("ended", doStreamEnd);
    Goniometer.stop();
    Goniometer.start(audio, goniometercanvas);
  }
  function doTrackEnd() {
    playingTrack++;
    if (playingTrack >= data.a.tracked.length) {
      playingTrack = -1;
      doStreamEnd();
    } else {
      playTrack(playingTrack);
    }
  }
  function doStreamEnd() {
    playingStream++;
    if (playingStream >= data.a.streams.length) {
      playingStream = -1;
      doTrackEnd();
    } else {
      playStream(playingStream);
    }
  }

  function fallbackAudioEnd() {
    audio.removeEventListener("ended", fallbackAudioEnd);
    doTrackEnd();
  }

  function renderer() {
    requestAnimationFrame(renderer);
    // display time
    try {
      if (!audio.paused) {
        position.innerText = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
      }
    } catch(e){}

    try {
      if (window.player) {
        if (!ScriptNodePlayer.getInstance().isPaused()) {
          position.innerText = formatTime( ScriptNodePlayer.getInstance().getCurrentPlaytime() ) + " [ " + ScriptNodePlayer.getInstance().getPlaybackPosition() +" / "+ ScriptNodePlayer.getInstance().getMaxPlaybackPosition() +" ]";
        }

      }
    } catch(e){}
  };

  function formatTime(s) {
    var m = Math.floor(s/60);
    var ss = Math.floor(s-m*60);
    if (ss<10) ss = "0"+ ss;
    return m+":"+ss;
  }

  function textboxShow(txt) {
    textbox.innerText = txt;
  }
  function displayPic(dat) {
    //console.log(dat);
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(new Blob([new Uint8Array(dat)]));
    console.log(imageUrl);
    picture.src = imageUrl;
  }

  function contentChanger() {
    content++;
    console.log("contentChanger",content);
    if (content === 0) {
      // start
      LDR.loadURL('data/results.txt', function(dat) {
        textboxShow(dat);
        setTimeout(contentChanger, slideTime);
      }, 'text');
    }
    if (content > 0 && content-1 < data.v.freestyle.length) {
      LDR.loadURL('data/v/freestyle/'+data.v.freestyle[content-1], function(dat) {
        displayPic(dat);
        setTimeout(contentChanger, slideTime);
      }, 'binary');
    }
    if (content > data.v.freestyle.length && content-data.v.freestyle.length-1 < data.v.pixel.length) {
      LDR.loadURL('data/v/pixel/'+data.v.pixel[content-data.v.freestyle.length-1], function(dat) {
        displayPic(dat);
        setTimeout(contentChanger, slideTime);
      }, 'binary');
    }

  }

  //
  // external available
  //
  my.playNextTrack = function() {
    doTrackEnd();
  }
  my.playNextStream = function() {
    doStreamEnd();
  }

  //
  // Exit
  //
  return my;

})();
