/* starting the budget making app

I will implement all the modules by using IIFE as varaible and function declared inside IIFE are not visible outside
(Data Privacy,Data Encapsulation).


First there are 3 modules 
    1. UI Controller (That controls the UI part of the app) 
    2. Event/GlobalApp Controller (All events that happens like click on button or doing things by pressing the enter key)
    3. Data/Budget Controller (Contains all data given by the user and all the calculations)
    
Steps how we want our app work

1. Select weather its a expense or income (Event Handler).
2. Add description , value 
3. Add new item to the data structure
4. Add item to the UI.
5. Calculate Budget.
6. Display the Budget.

*/

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// BUDGET CONTROLLER
var budgetController = (function(){
   
    var expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }
    var income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    // The below written prototype of of expense is actually availabe to all expense objects;;
    expense.prototype.calcPercentage = function(totalIncome){
        
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    
    };
    
    expense.prototype.getPercentage =function(){
        return this.percentage;
    };
    
    
    
    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
        
    };
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    
    return {
        addItem : function(type,des,val){
            var newItem,ID;
        
        if(data.allItems[type].length === 0){
            ID=0;
        }
        else{
            ID=parseInt(data.allItems[type][data.allItems[type].length-1].id+1);
        }
        
        
        
        if(type === 'exp'){
            newItem=new expense(ID,des,val);
                
            }
        else if(type === 'inc'){
            newItem=new income(ID,des,val);
            
        }
        
        // pushing this newItem to our database;
        data.allItems[type].push(newItem);
        
        // return newItem
        
        return newItem;
            
            
        },
        
        
        deleteItem : function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            console.log('you tried to delete a itwm')
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        
        
        calculateBudget : function(){
            // budget is total inc - total exp
            calculateTotal('exp');
            calculateTotal('inc');
            
            data.budget = data.totals.inc - data.totals.exp;
            
             // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }  
            
            
            
        },
        
        
         
        
        
        calculatePercentages: function() {
            
            /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */
            
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
        },
        
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        
        
        
        
        getBudget: function() {
            return {
                budget: parseFloat(data.budget),
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing : function(){
            console.log(data);
        }
    
    
    }
    
    
    
    
    
    
    
    
    
}) ();


// UI CONTROLLER 
var UIController = (function(){
   
  //--------------------------------------------------------------------------------------------------------------------------------------------
    // jo values boxes mein hai woh read yahan se hongi because user enter idhr karega 
    // So you have to read values from here ....
    // So we have 4 values to be read 1.InputType(expense or income) 2.InputDescription 3.InputValue 4.InputButton
    // So we have to return all 4 of these string to the event and budget controller to calculate budget
    // Hence we take these strings as one object and return it to the UIController function;
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeList : '.income__list',
        expensesList : '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        container : '.container'
   
        
    };
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
   //------------------------------------------------------------------------------------------------------------------------------------------- 
    var formatNumbers =function(num,type){
        // appending the 2 decimals to an int and converting all numbers to 2 decimal digits
        num=Math.abs(num);
        num=num.toFixed(2);
        
        // if type===exp then it will append a negative sign else it will append a positive sign;
         return((type==='exp')?'-':'+')+num;
        
    }
    
    
    
// --------------------------------------------------------------------------------------------------------------------------------------------
    
    
    return {
        
        
        clearValues : function(){
            var fields, fieldsArr;
            
            
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();// this will set focus to the first cell;;
    
         },
        
        
        addListItem : function(obj,type){
            var html,element,new_html;
            
            
            
            if(type==='inc'){
                element=DOMStrings.incomeList;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=DOMStrings.expensesList;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            new_html=html.replace('%id%',obj.id);
            new_html=new_html.replace('%description%',obj.description);
            new_html=new_html.replace('%value%',formatNumbers(obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',new_html);
            
           
            
            
        },
        
        
        // direct deletion javaScript do not support so phle parent pr jaaenge phir wapas child delete karenge;;
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        getInput : function(){
            return{
                // now type would contain value selected at the type(+/-) description would contain the description entered by user samefor val;
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
            
        },
        //-------------------------------------------------------------------------------------------------------------------------------------
        displayMonth : function(){
          var now;
            
            now=new Date();// this now now has the current systems date and time;;
            var year=now.getFullYear();
            var month=now.getMonth();
            var time=now.getDay();
            var montharr=['Jan','Feb','Mar','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
            
            
            document.querySelector(DOMStrings.dateLabel).textContent = montharr[month] + ' , ' + year;
            
            
        },
        
        //--------------------------------------------------------------------------------------------------------------------------------------
        
        
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbers(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbers(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumbers(obj.totalExp,'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        
       
        
       displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = formatNumbers(percentages[index]) + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        getDOMStrings : function(){
            return DOMStrings;
        }
        
        
        
    }
    
    
    
    
    
    
}) ();


// GLOBAL APP CONTROLLER
var appController = (function(budgtCntl,UICntl){
    
    //add__value
    
    var setupEventListeners=function(){
        
            var DOM = UICntl.getDOMStrings();
        
            document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
            document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which===13)
               {
                   ctrlAddItem();
               }
        });
        
        
            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        
    }
    
    
    
    
    
    // function below defines that ki value wale tick pe click ho chuka hai so now we have to add that item to the budget and calulate it;;
    var ctrlAddItem = function(){
        var newItem,input;
        // 1. Get the feild`s input data
        input=UICntl.getInput();
        
        // 2. Add item to the budgetController...
        newItem=budgtCntl.addItem(input.type,input.description,input.value);
        
        //  Check if any value is null or not meaning that user has entered the description and value ;; 
        //  Since you entered the value as a number so if you won`t put a value in place of a value feild that it willbe set to NAN.
        // 3. Add item to the UI
        if(newItem.description!=="" && !isNaN(newItem.value) && newItem.value>0)
        UICntl.addListItem(newItem,input.type);
        
        // 4. Clear feild values after addition of newItem so that enter press krne pr wapas na wohi value aaye and adjust foucus to first cell
        UICntl.clearValues();// and adjusting focus back to first cell;;;; 
        //-------------------------------------------------------------------------------------------------------------------------------------
        
        
        // 4. Calulate the budget
        budgtCntl.calculateBudget();
        
        // 5. Display the budget on the UI
        var budget = budgtCntl.getBudget();
        
        
        UICntl.displayBudget(budget);
        
        
        //--------------------------------------------------------------------------------------------------------------------------------------
        
            // 1. Calculate percentages
            budgtCntl.calculatePercentages();

            // 2. Read percentages from the budget controller
            var percentages = budgtCntl.getPercentages();

            // 3. Update the UI with the new percentages
            UICntl.displayPercentages(percentages);

        
        
        
    
        
        
        
    }
    
    
    var ctrlDeleteItem=function(event){
        var itemID,splitID,type,ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //console.log(itemID);
        
        
        // it will be of form (inc-1)
        if(itemID){
            splitID=itemID.split('-');
            type=splitID[0]; // phla term that will give the type
            ID=parseInt(splitID[1]); // second termm that will give the id no ki konsa elemnent delete hua hai
            
            budgtCntl.deleteItem(type,ID);
            UICntl.deleteListItem(itemID);
            
            
                // 4. Calulate the budget
            budgtCntl.calculateBudget();

            // 5. Display the budget on the UI
            var budget = budgtCntl.getBudget();


            UICntl.displayBudget(budget);
            
            
            
            // 1. Calculate percentages
            budgtCntl.calculatePercentages();

            // 2. Read percentages from the budget controller
            var percentages = budgtCntl.getPercentages();

            // 3. Update the UI with the new percentages
            UICntl.displayPercentages(percentages);

             
            
        }
        
        
    };
    
    
    
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
            UICntl.displayMonth();
            UICntl.displayBudget({
                budget:0,
                totalExp :0,
                totalInc :0,
                percentage :-1
            })
            
        }
    };
    
    
    
    
}) (budgetController,UIController);


// Application Starts By calling the init() function of the AppController Module which then calls the SetUpEventListeners Function;;;;
appController.init();






