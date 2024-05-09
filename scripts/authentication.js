const accessCodes = ["Admin","u92805","u48317","u59621","u24893","u30716","u72946","u13598","u95467","u86371","u47203","u70384","u31596","u62803","u19435","u85672","u27165","u48930","u17249","u56942","u94361","u79183","u05791","u31457","u94681","u16583","u38217","u59238","u21754","u67845","u19764","u74169","u84395","u23416","u78469","u56913","u31845","u96278","u42739","u14876","u83519","u75321","u27649","u69815","u84297","u45812","u37251","u78946","u93486","u42196","u15789","u29634","u76392","u61985","u18627","u94871","u83426","u59472","u38761","u27613","u96831","u49673","u71592","u84236","u56197","u39582","u18347","u75839","u31476","u82413","u71978","u37829","u34182","u14692","u95823","u38571","u62987","u85134","u19874","u47329","u28574","u63789","u12596","u96345","u85491","u38915","u74638","u29487","u16347","u75684","u48521","u92185","u57346","u81697"]
const USERS_URL = 'https://codeventure-data.onrender.com/users/'

async function logIn(code){
    return fetch(USERS_URL)
    .then(res=>res.json())
    .then(users => {
        let userExists = false;

        users.forEach(user => {
            if(user.username == code){
                userExists = true;
                localStorage.setItem('user-id',user.id)
                return 0
            }
        });

        if (!userExists){
            return createNewUser(users, code)
        }
    })

}

async function createNewUser(users, code){
    const newID = users.length + 1

    const user = {
        "id": newID.toString(),
        "username": code,
        "user courses": [
            {
                "course name": "Programming Fundamentals I",
                "progress": {
                "activities completed": 0,
                "quiz score": 0
                }
            }
        ]
        }
    
    localStorage.setItem('user-id',newID)

    return fetch(USERS_URL,{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    })
}

$(document).ready(()=>{
    const code = $("#access-code")
    const btnSubmit = $("#submit") 
    const label = $("label") 
    const container = $("#container") 
    

    btnSubmit.on('click', async ()=>{
        const accessCode = code.val()
        if(accessCodes.includes(accessCode)){
            await logIn(accessCode)
            .then(()=>{
                container.addClass('accept')
                setTimeout(()=>{
                    window.location.assign('home.html')
                },1000)
            })
        } else {
            code.addClass('error')
            label.addClass('error')
            label.text('Invalid Code!')
            setTimeout(()=>{
                label.removeClass('error')
                code.removeClass('error')
                label.text('Enter Access Code')
            },800)
        }
    })
})
