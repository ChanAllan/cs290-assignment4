var gistList = [];

function Gist(description, link, language) {
  this.description = description;
  this.link = link;
  this.language = language;
}

function addGist(gist) {
 
  for (var i = 0; i < gistList.length; i++) {
    if (gistList[i].link === gist.link) {
      return;
    }
  }
  gistList.push(gist);
}

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

    };


    description.id = contentlist[i].link;

    list.appendChild(description);

    description.appendChild(language);
    description.appendChild(link);
    description.appendChild(fave_button);
  }
}

function addToFave() {
  var list = document.getElementById('favored-gists');
  var id, description, link, language;

}

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
          for (var property in new_gist[i].files) {
            if (new_gist[i].files[property].language) {
              language = new_gist[i].files[property].language;
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

window.onload = function() {

};


