let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function () {
        if(name.value.length == 0) {
            setTextValue('.textContent', "");
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;;
            setTextValue('.textContent',  "");
        } catch (e) {
            setTextValue('.textContent',  e);
        }
    });

    const date  = document.querySelector('#date');
    date.addEventListener('input', function () {
        const startDate = new Date(Date.parse(getInputValueById('#day')+" "+
                                              getInputValueById('#month')+" "+                                
                                              getInputValueById('#year')));
        try {
            (new EmployeePayrollData()).startDate = startDate;
            setTextValue('.date-error', "");
        } catch (e) {
            setTextValue('.date-error', e);
        }
    });
    const salary = document.querySelector('#salary');
    setTextValue('.salary-output', salary.value);
    salary.addEventListener('input', function() {
        setTextValue('.salary-output', salary.value);
    });
    checkForUpdate();
});

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false ;
    if (!isUpdate) return ;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setvalue('#name', employeePayrollObj._name);
    setSelectedValues('[name = profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name = gender]', employeePayrollObj._gender);
    setSelectedValues('[name = department]', employeePayrollObj._department);
    setvalue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setvalue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setvalue('#day', date[0]);
    setvalue('#month', date[1]);
    setvalue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if (item.value === value)
            item.checked = true;
    });
}

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        createAndUpdateStorge();
        resetForm();
        window.location.replace(site_properties.home_page);
    } catch (e) {
        return;
    }
}

const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name = gender ]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollObj._startDate = date;
}

const createAndUpdateStorge = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(empPayrollList){
        let empPayrollData = employeePayrollList.
                             find(empData => empData._id == employeePayrollObj._id);
        if(!empPayrollData) {
            employeePayrollList.push(createEmployeePayollData());
        } else {
            const index = employeePayrollList
                          .map(empData => empData._id)
                          .indexOf(empPayrollData._id);
            employeePayrollList.splice(index,1, createEmployeePayollData(empPayrollData._id))
        }
    } else {
        employeePayrollList = [createEmployeePayollData()]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

function createAndUpdateStorge(employeePayrollData){
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList != undefined){
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

const createEmployeePayoll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.text-error',e);
        throw e;
    }
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name = department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollData.date = Date.parse(date);
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const createEmployeePayollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if(!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id ;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
        employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error', e)
        throw e;
    }
    alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
}

const resetForm = () => {
    setvalue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setvalue('#salary','');
    setvalue('#notes','');
    setvalue('#day','1');
    setvalue('#month','1');
    setvalue('#year','2020');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setvalue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}