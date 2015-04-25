var settings = null;

function Gist(description, request_url, language) {
  this.description = description;
  this.request_url = request_url;
  this.language = language;
}

function addGist(settings, gist) {
  settings.gists.push(gist);
  localStorage.setItem('userSettings', JSON.stringify(settings));
}

function getGists() {
  var request = new XMLHttpRequest();
    if (!request) {
      throw 'HttpRequest cannot be created';
    }
	var url = 'https://api.github.com/gists';

	request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var new_gist = JSON.parse(this.responseText);
        for (var i = 0; i < new_gist.length; i++) {
          var description = new_gist[i].description;
          if (description === null || description ==="") {
            description = "No desc provided";
          }
          var request_url = new_gist[i].html_url;
          var language = "";
          for (var property in new_gist[i].files) {
            if (new_gist[i].files[property].language) {
              language = new_gist[i].files[property].language;
            }
            var next_gist = new Gist(description, request_url, language);
          }
        }
      }
	};
	request.open('GET', url, true);
	request.send(null);
}

window.onload = function() {
  var settingsStr = localStorage.getItem('userSettings');
  if (settingsStr === null) {
    settings = {'gists': []};
    localStorage.setItem('userSettings', JSON.stringify(settings));
  } else {
    settings = JSON.parse(localStorage.getItem('userSettings'));
  }
};
