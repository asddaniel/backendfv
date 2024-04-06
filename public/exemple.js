

Promise.all([
    fetch("http://localhost:8000/api.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:"student", id:3}),
    }), 
    fetch("http://localhost:8000/api.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name:"student", id:4}),
    })
])
.then(function(resp1, resp2){
    //manipuler la reponse 1
    console.log(resp1);

    //manipuler la reponse 2
    console.log(resp2);
})