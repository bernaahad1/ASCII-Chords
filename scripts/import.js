


      window.onload = function(event) {
        document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
      }
      function handleFileSelect(event) {
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
          console.log(event.target.result);
        }
        var file = event.target.files[0];
        fileReader.readAsText(file);
      }
