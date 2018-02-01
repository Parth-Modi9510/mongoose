let bcrypt = require(`bcryptjs`);

let password = `abc123!`;

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
    });
    let hashed = `$2a$10$WFwH0xFz6.ZTIRYJNbWhAeRkkmu8GKHmbb68dErVKH3IfwXtQZOBS`;
    bcrypt.compare(password,hashed,(err,res)=>{
        console.log(res);
});
});
