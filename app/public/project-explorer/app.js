const getPrograms = () => {
    let programsElement = document.querySelector("#program");

    fetch("/api/programs")
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(`GET PROGRAM LIST STATUS !200 but: ${response.status}`)
            }
        })
        .then(data => {
            return data.forEach(program => {
                let optionElement = document.createElement("option");
                // let optionValue = program.split(" ").join("_");
                optionElement.value = program;
                optionElement.textContent = program;
                programsElement.append(optionElement);
            });
        })
        .catch(err => {
            console.error(`GET PROGRAM ERROR: ${err.message}`);
        })
}


const getGraduationYears = () => {
    let graduationYearsElement = document.querySelector("#graduationYear");

    fetch("/api/graduationYears")
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(`GET GRADUATION YEARS STATUS !200 but: ${response.status}`)
            }
        })
        .then(data => {
            data.forEach(year => {
                let optionElement = document.createElement("option");
                optionElement.value = year;
                optionElement.textContent = year;
                graduationYearsElement.append(optionElement);
            })
        })
        .catch(err => {
            console.error(`GET GRADUATION YEARS ERROR: ${err.message}`);
        })
}

const signupFormSubmission = () => {
    const form = document.querySelector("#signupForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        let firstNameInput = document.querySelector("#signupForm #firstName");
        let lastNameInput = document.querySelector("#signupForm #lastName");
        let emailInput = document.querySelector("#signupForm #email");
        let passwordInput = document.querySelector("#signupForm #password");
        let matricNumberInput = document.querySelector("#signupForm #matricNumber");
        let programInput = document.querySelector("#signupForm #program");
        let graduationYearInput = document.querySelector("#signupForm #graduationYear");

        let formDataObj = {
            firstname: firstNameInput.value,
            lastname: lastNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            matricNumber: matricNumberInput.value,
            program: programInput.value,
            graduationYear: graduationYearInput.value
        };


        fetch("/api/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => response.json())
            .then(response => {
                if (response.status === "ok") {
                    let key = "uid";
                    let cookieAge = 60 * 60 * 24 * 7;
                    let value = encodeURIComponent(response.data.id);
                    document.cookie = `${key}=${value}; max-age=${cookieAge}; path=/;`;
                    location.assign("index.html")
                } else {
                    let alert = document.querySelector("#alert");
                    response.errors.forEach(validationError => {
                        let errorElement = document.createElement("p");
                        errorElement.textContent = validationError;
                        alert.append(errorElement);
                        alert.classList.remove("d-none")
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    })
}


if (window.location.href.includes("register.html")) {
    getPrograms();
    getGraduationYears();
    signupFormSubmission();
}


const createProject = () => {
    let form = document.querySelector("#createProjectForm");
    let projectDataObj = {};

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let name = document.querySelector("#createProjectForm input[name=\"name\"]");
        let abstract = document.querySelector("#createProjectForm textarea[name=\"abstract\"]");
        let authors = document.querySelector("#createProjectForm input[name=\"authors\"]");
        let tags = document.querySelector("#createProjectForm input[name=\"tags\"]");

        let authorsArr = [];
        authors.value.split(",").filter(author => {
            authorsArr.push(author.trim());
        })

        let tagsArr = [];
        tags.value.split(",").filter(tag => {
            tagsArr.push(tag.trim())
        })


        projectDataObj.name = name.value;
        projectDataObj.abstract = abstract.value;
        projectDataObj.authors = authorsArr;
        projectDataObj.tags = tagsArr;

        fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectDataObj)
            })
            .then(response => {
                if (response.status === 200) {
                    location.assign("index.html")
                } else {
                    return response.json()
                }
            })
            .then(response => {
                let alertDiv = document.querySelector("#createProjectForm .alert");
                alertDiv.classList.remove("d-none");

                response.errors.forEach(err => {
                    let errorElement = document.createElement("p");
                    errorElement.textContent = err;
                    alertDiv.append(errorElement)
                })
            })
            .catch(err => {
                console.error(`SUBMIT PROJECT FETCH REQ ERROR: ${err.message}`);
            })
    })
}


window.onload = () => {

    let uid = "";
    const loggedOutNav = document.querySelector("#logged-out");
    const loggedInNav = document.querySelector("#logged-in");

    function getUidCookie() {
        let allCookiesSeperated = document.cookie.split(";");
        allCookiesSeperated.filter(singleCookieString => {
            if (singleCookieString.startsWith("uid"))
                uid = singleCookieString.split("=")[1];
        })
    }
    getUidCookie();


    if (uid !== "") {
        fetch(`/api/users/${uid}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`FETCH USER INFO BY UID STATUS CODE !200 but: ${response.status}`)
                }
            })
            .then(data => {
                const usernameLink = document.querySelector("#username");
                const logOutLink = document.querySelector("#logout");

                const changeNavToLoggedIn = () => {
                    usernameLink.innerHTML = `Hi, ${data.firstname}`;
                    loggedOutNav.classList.add("d-none");
                    loggedInNav.classList.remove("d-none");
                }
                changeNavToLoggedIn()


                logOutLink.addEventListener("click", (e) => {
                    e.preventDefault()
                    document.cookie = `uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    location.replace("index.html");
                })
            })
            .catch(err => {
                console.error(err.message);
            })



        if (window.location.href.includes("createproject.html")) {
            createProject()
        }
    } else {
        console.log("User Logged Out State")

        if (window.location.href.includes("createproject.html")) {
            location.assign("login.html")
        }
    }

}


const logUserIn = () => {
    const form = document.querySelector("#loginForm");
    let userEmail = document.querySelector("#loginForm #email");
    let userPassword = document.querySelector("#loginForm #password");


    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let loginCredentials = {
            email: userEmail.value,
            password: userPassword.value
        }

        fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginCredentials),
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    document.querySelector("#loginForm .alert").classList.remove("d-none");
                }
            })
            .then(response => {
                let cookieValue = encodeURIComponent(response.data.id);
                let maxAge = 60 * 60 * 24 * 7;
                document.cookie = `uid=${cookieValue}; path=/; max-age=${maxAge}`;
                location.replace("index.html")
            })
            .catch(err => {
                console.error(`USER CREDENTIALS POST ERRO ${err.message}`);
            })
    })
}

if (window.location.href.includes("login.html")) {
    logUserIn()
}


const updateProjectList = () => {
    let cardsContainter = document.querySelector("#project-cards-container");
    fetch("/api/projects")
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(`GET PROJECTS ERROR`)
            }
        })
        .then(data => {
            console.log(data)
            for (let i = 0; i < 4; i++) {
                let project = data[i];

                let cardTemplate = `
                    <section class="card my-4">
                        <div class="card-body">
                            <a href="viewproject.html?id=${project.id}">
                                <h4 class="text-primary card-title">${project.name}</h4>
                            </a>
                            <h6 class="card-subtitle">${project.authors.join(", ")}</h6>
                            <p class="card-text">${project.abstract}</p>
                            <p class="text-primary">${project.tags.join(" ")}</p>
                        </div>
                    </section>`;

                let cardElement = document.createElement("div");
                cardElement.classList.add("col-sm-3");
                cardElement.innerHTML = cardTemplate;

                cardsContainter.append(cardElement)
            }
        })
        .catch(err => {
            console.log(`GET PROJECTS ERROR: ${err.message}`)
        })
}

updateProjectList()


if (location.href.includes("viewproject.html")) {
    let projectId = location.href.split("=")[1]
    fetch(`/api/projects/${projectId}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(`FETCH Single Project Error, Status !200 but ${response.status}`)
            }
        })
        .then(data => {
            let projectName = document.querySelector("#project_name");
            let projectAbstract = document.querySelector("#project_abstract");
            let projectAuthors = document.querySelector("#project_authors");
            let projectTags = document.querySelector("#project_tags");


            projectName.textContent = data.name;
            projectAbstract.textContent = data.abstract;

            data.authors.forEach(author => {
                let authorElement = document.createElement("li");
                authorElement.classList.add("list-group-item");
                authorElement.textContent = author;
                projectAuthors.append(authorElement)
            })

            data.tags.forEach(tag => {
                let tagElement = document.createElement("p");
                tagElement.classList.add("text-primary");
                tagElement.textContent = tag;
                projectTags.append(tagElement)
            })

            let creatorsId = data.createdBy;
            fetch(`/api/users/${creatorsId}`)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error(`Response.status != 200 but: ${response.status}`)
                    }
                })
                .then(creatorsData => {
                    let createdBy = document.querySelector("#project_author");

                    createdBy.textContent = `${creatorsData.firstname} ${creatorsData.lastname}`
                })
                .catch(err => {
                    console.log(err.message)
                })

        })
        .catch(err => {
            console.error(err.message);
        })
}