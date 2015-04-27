var gistList = [];

function Gist(description, link, language) {
  this.description = description;
  this.link = link;
  this.language = language;
}

/*Gets the requested number of gist pages*/
function getGists() {
  var numpage = document.getElementsByName('numpage')[0].value;

  for (var i = 0; i < numpage; i++) {

    /*XMLHTTPRequest code obtained from Mozilla Developer Network*/
    var request;
    if (window.XMLHttpRequest) {   /*Mozilla, Safari, IE7+...*/
      request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { /*IE6 and older*/
      request = new ActiveXObject("Microsoft.XMLHTTP");
      }
    if (!request) {
      throw 'HttpRequest cannot be created';
    }
  
    var url = 'https://api.github.com/gists?page=' + numpage + '&per_page=30';

    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var new_gist = JSON.parse(this.responseText);
        for (var i = 0; i < new_gist.length; i++) {
          var description = new_gist[i].description;
          var link = new_gist[i].html_url;
          var language = "";
          for (var prop in new_gist[i].files) {
            if (new_gist[i].files[prop].language) {
              language = new_gist[i].files[prop].language;
            }
            var next_gist = new Gist(description, link, language);
            addGist(next_gist);
          }
        }
      }
      showGist(gistList);
    };
  
  request.open('GET', url, true);
  request.send(null);
  
  }
}

function addGist(gist) {
  /*Checks that identical links are not added twice*/
  for (var i = 0; i < gistList.length; i++) {
    if (gistList[i].link === gist.link) {
      return;
    }
  }
  gistList.push(gist);
}

/*Displays the gist search results based on number of pages*/
function showGist(contentlist) {
  var list = document.getElementById('gists');
  var id, description, link, language;
  
  for (var i in contentlist) {
    id = contentlist[i].link;
    description = document.createElement('div');
    link = document.createElement('a');
    language = document.createElement('p');

    if (contentlist[i].description === null || contentlist[i].description ==="") {
      description.innerHTML = 'Description: No description provided';
    } else {
      description.innerHTML = 'Description: ' + contentlist[i].description;
    }

    link.setAttribute('href', contentlist[i].link);
    link.innerHTML = contentlist[i].link;
    language.innerHTML = 'Language: ' + contentlist[i].language;


    var fave_button = document.createElement('button');
    fave_button.innerHTML = 'Add to Favorite Gists';
    fave_button.setAttribute('fave_link', contentlist[i].link);
    
    fave_button.onclick = function() {
      var fave_link = this.getAttribute('fave_link');
      favegist.favorites.push(fave_link);
      localStorage.setItem('myfav', JSON.stringify(favegist));
      addToFave(fave_link);
    };

    description.id = contentlist[i].link;
    list.appendChild(description);
    description.appendChild(language);
    description.appendChild(link);
    description.appendChild(fave_button);
  }
}

/*Adds gists to favorite gists list*/
function addToFave(fave_link) {
  var list = document.getElementById('favored-gists');
  var id = fave_link.link;
  var description = document.createElement('div');
  var link = document.createElement('a');
  var language = document.createElement('p');

  if (fave_link.description === null || fave_link.description === "") {
    description.innerHTML = 'Description: No description provided';
  } else {
    description.innerHTML = 'Description: ' + fave_link.description;
  }

  link.setAttribute('href', fave_link.link);
  link.innerHTML = fave_link.link;
  language.innerHTML = 'Language: ' + fave_link.language;

  description.id = fave_link.link;
  list.appendChild(description);
  description.appendChild(language);
  description.appendChild(link);
}

/*Displays the favorite gists list*/
function showFaveGist(fave_list) {
  var list = document.getElementById('favored-gists');

  for (var i in fave_list) {
    var id = fave_list.link;
    var description = document.createElement('div');
    var link = document.createElement('a');
    var language = document.createElement('p');

    if (fave_list[i].description === null || fave_list[i].description === "") {
      description.innerHTML = 'Description: No description provided';
    } else {
      description.innerHTML = 'Description: ' + fave_list.description;
    }

    link.setAttribute('href', fave_list[i].link);
    link.innerHTML = fave_list[i].link;
    language.innerHTML = 'Language: ' + fave_list[i].language;

    var unfavorite_button = document.createElement('button');
    unfavorite_button.innerHTML = 'Remove for Favorite Gists';
    unfavorite_button.setAttribute('removelink', fave_list[i].link);
    
    unfavorite_button.onclick = function() {
      var removelink = this.getAttribute('removelink');
      remove(removelink);
    };

    description.id = fave_list[i].link;
    list.appendChild(description);
    description.appendChild(language);
    description.appendChild(link);
    description.appendChild(unfavorite_button);
  }
}

/*Remove gists from favorite gists list*/
function remove(removelink) {

}

/*Used to clear local storage*/
function clearLocalStorage() {
  localStorage.clear();
}

/*Code gotten from AJAX code demo lecture*/
window.onload = function() {
  var favegistStr = localStorage.getItem('myfav');
  if (favegistStr === null) {
    favegist = {'favorites':[]};
    localStorage.setItem('myfav', JSON.stringify(favegist));
  } else {
    favegist = JSON.parse(localStorage.getItem('myfav'));
  }
  showFaveGist(favegist.favorites);
  //clearLocalStorage();
};


