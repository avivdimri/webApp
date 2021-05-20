function doupload() {
    console.log("aviv the king");
    let data = document.getElementById("file").files[0];
    let entry = document.getElementById("file").files[0];
    console.log('doupload',entry,data)
    fetch('uploads/' + encodeURIComponent(entry.name), {method:'PUT',body:data});
    alert('your file has been uploaded');
    location.reload();
};