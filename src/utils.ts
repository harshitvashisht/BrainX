export function random (len:number){
    let options ="aljkfhadgjf;skljahkjban1234567890"
    let lengeth = options.length
    let ans= ""
    for (let i = 0 ; i<len; i++){
        ans+=options[Math.floor((Math.random()* lengeth))]
    }
    return ans;
}