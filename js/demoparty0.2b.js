/* Demo party player by DrSnuggles 2019

*/

"use strict";

var demoparty = (function (){
  //
  // vars
  //
  var my = {}; // return object
  var data;    // party entries
  var audio;
  var currentTrack = -1;
  var currentPic = -1;
  var currentTxt = -1;

  document.oncontextmenu = function(){return false;};

  //
  // init workers
  //

  //
  // load libs
  //
  loadScript('js/ldr.js', function() {
    applyStyle('amiga', function() {
      LDR.loadURL('js/goniometer.js', function(dat) {
        addHead('script', dat);

        LDR.loadURL('com/scriptprocessor_player.js', function(dat) {
          addHead('script', dat);

          LDR.loadURL('com/backend_mpt.js', function(dat) {
            addHead('script', dat);

            LDR.loadURL('data/data.json', function(dat) {
              data = JSON.parse(dat);
              playNextTrack();

              LDR.loadURL('com/ansilove.js', function(dat) {
                addHead('script', dat);

                // show results
                LDR.loadURL('data/results.txt', function(dat) {
                  resultsbox.innerText = dat;
                  showNextPic();
                  showNextTxt();
                  // done here start renderer
                  requestAnimationFrame(renderer);
                }, 'text');

              }, 'text');
            }, 'text');
          }, 'text');
        }, 'text');
      }, 'text');
    });
  });

  //
  // private functions
  //
  function playNextTrack(i) {
    if (i === undefined || typeof i === 'object' ) i = 1;
    currentTrack += i;
    if (currentTrack < 0) currentTrack = data.a.tracked.length+data.a.streams.length-1;
    if (currentTrack >= data.a.tracked.length+data.a.streams.length) currentTrack = 0;
    console.log("playNextTrack", currentTrack);

    try {
      Goniometer.stop();
      if (typeof window.player !== 'undefined') ScriptNodePlayer.getInstance().pause();
      audio.pause();
      audio.removeEventListener("ended", playNextTrack);
      audio.delete();
    } catch(e) {}

    var song = 'data/a/';
    if (currentTrack < data.a.tracked.length) {
      song += 'tracked/'+data.a.tracked[currentTrack];
    } else {
      song += 'streams/'+data.a.streams[currentTrack-data.a.tracked.length];
    }
    trackTitle.innerText = song.substr(song.lastIndexOf("/")+1);
    //title.innerText = song.substr(song.lastIndexOf("/")+1);
    // mp3/ogg || tracker
    var ext = getExt(song);
    if (ext === "mp3" || ext === "ogg") {
      audio = new Audio(song);
      audio.play();
      audio.addEventListener("ended", playNextTrack);
      Goniometer.start(audio, goniometercanvas);
    } else {
      ScriptNodePlayer.createInstance(new MPTBackendAdapter(), "", [], false, function(){}, function(){}, playNextTrack); // backendAdapter, basePath, requiredFiles, enableSpectrum, onPlayerReady, onTrackReadyToPlay, onTrackEnd, doOnUpdate, externalTicker
      ScriptNodePlayer.getInstance().loadMusicFromURL(song, {}, function(){}, function(){}, function(){}); // url, options, onCompletion, onFail, onProgress
      Goniometer.start(ScriptNodePlayer.getInstance()._gainNode, goniometercanvas);
    }
  }
  function showNextPic(i) {
    if (i === undefined) i = 1;
    currentPic += i;
    if (currentPic < 0) currentPic = data.v.freestyle.length + data.v.pixel.length-1;
    if (currentPic >= data.v.freestyle.length + data.v.pixel.length) currentPic = 0;
    var fn = '';
    if (currentPic < data.v.freestyle.length) {
      fn = 'freestyle/'+data.v.freestyle[currentPic];
    } else {
      fn = 'pixel/'+data.v.pixel[currentPic-data.v.freestyle.length];
    }
    picture.src = 'data/v/'+ fn;
    picName.innerText = fn;
  }
  function showNextTxt(i) {
    if (i === undefined) i = 1;
    currentTxt += i;
    if (currentTxt < 0) currentTxt = data.v.ansi_amiga.length + data.v.ansi_pc.length-1;
    if (currentTxt >= data.v.ansi_amiga.length + data.v.ansi_pc.length) currentTxt = 0;
    var fn = '';
    if (currentTxt < data.v.ansi_amiga.length) {
      fn += 'amiga/'+data.v.ansi_amiga[currentTxt];
    } else {
      fn += 'pc/'+data.v.ansi_pc[currentTxt-data.v.ansi_amiga.length];
    }
    txtTitle.innerText = fn;
    textbox.innerText = '';
    fn = 'data/v/ansi_' +fn;
    if (getExt(fn) === "ans") {
      // ANSI
      AnsiLove.splitRender(fn, function (canvases, sauce) {
        canvases.forEach(function (canvas) {
          canvas.style.verticalAlign = "bottom"; // For perfect, gap-less viewing.
          textbox.appendChild(canvas);
        });
        //console.log(sauce);
      }, 27, {"bits": "8"});
    } else {
      // ASCII / TXT
      LDR.loadURL(fn, function(dat) {
        textbox.innerText = dat;
      }, 'text');

    }
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

    // display memory
    try {
      memory.innerText = formatBytes(performance.memory.usedJSHeapSize) +' / '+ formatBytes(performance.memory.totalJSHeapSize) +' / '+ formatBytes(performance.memory.jsHeapSizeLimit);
    } catch(e){}

    // display time (not amiga style but i like it)
    try {
      var now = new Date();
      now = now.toLocaleTimeString();
      clock.innerText = now;
    } catch(e){}

    // img.onload did just fire once a while
    resizePicView();
  };

  //
  // private helper functions
  //
  function loadScript(src, cb) { // loadScript (often one of my first functions i call)
    var script = document.createElement("script");
    script.onload = function() {
      if (cb) cb();
    };
    script.src = src;
    document.head.appendChild(script);
  }
  function addHead(tag, txt, cb) { // maybe move to LDR ??
    var tmp = document.createElement(tag);
    tmp.type = (tag==='script')? 'text/javascript':'text/css';
    //tmp.text = txt; // works for script only
    tmp.appendChild(document.createTextNode(txt)); // works for script and style
    document.head.appendChild(tmp);
    if (cb) cb();
  }
  function applyStyle(style, cb) {
    // load CSS
    LDR.loadURL('style/'+ style +'/style.css', function(dat) {
      addHead('style', dat, function() {
        LDR.loadURL('style/'+ style +'/layout.html', function(dat) {
          document.body.innerHTML += dat;
          //document.body.setAttribute("contenteditable", true); // for playing around
          // exit
          if (cb) cb();
        }, 'text');
      });
    }, 'text');
  }
  function formatBytes(bytes) {
    // b, kB, MB, GB
    var kilobytes = bytes/1024;
    var megabytes = kilobytes/1024;
    var gigabytes = megabytes/1024;
    if (gigabytes>1) return gigabytes.toFixed(2) +' GB';
    if (megabytes>1) return megabytes.toFixed(2) +' MB';
    if (kilobytes>1) return kilobytes.toFixed(2) +' kB';
    return bytes +' b';
  }
  function formatTime(s) {
    var m = Math.floor(s/60);
    var ss = Math.floor(s-m*60);
    if (ss<10) ss = "0"+ ss;
    return m+":"+ss;
  }
  function getExt(fn) {
    return fn.substr(fn.lastIndexOf(".")+1).toLowerCase();
  }
  function resizePicView() {
    PicView.style.height = picture.height+40 +'px';
  }

  //
  // public functions
  //
  my.playNextTrack = function() {playNextTrack();}
  my.playPrevTrack = function() {playNextTrack(-1);}
  my.showNextPic = function() {showNextPic();}
  my.showPrevPic = function() {showNextPic(-1);}
  my.showNextTxt = function() {showNextTxt();}
  my.showPrevTxt = function() {showNextTxt(-1);}

  //
  // Exit
  //
  return my;

})();
