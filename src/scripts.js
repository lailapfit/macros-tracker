(function($) {
    let macrosDataSet = [];
    const formioURL = 'https://uefnzupxcofdtjl.form.io/macrotracker';

    function renderDataTable(data) {
        if(data) {
            macrosDataSet = buildDataSet(data);
        }
        const table = $('#datatable-macros').DataTable( {
            data: macrosDataSet,
            columns: [
                { 
                    title: 'Month/Week',
                    data: 'MonthlyWeekly' 
                },
                {   
                    title: 'Weight',
                    data: 'Weight'
                },
                { 
                    title: 'TDEE',
                    data: 'TDEE'
                },
                {   
                    title: 'Deficit/Surplus',
                    data: 'DeficitSurplus'
                },
                { 
                    title: 'Protein',
                    data: 'Protein' 
                },
                {   title: 'Fats',
                    data: 'Fats'
                },
                {   title: 'Carbs',
                    data: 'Carbs'
                }
            ]
        });
    };

    function renderFormioForm() {
        Formio.createForm(document.getElementById('track-macros__formio-form'), formioURL);
    };

    function getFormioData(url) {
        let promise = new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                success: function(submission) {
                    resolve(submission);
                },
                error: function(err) {
                    reject(err);
                }
            })
        })

        return Promise.resolve(promise);
    };

    function buildDataSet(macros) {
        let dataSet = [];
        macros.forEach(function(macro) {
            dataSet.push({
                MonthlyWeekly: macro.data.enterWeekNumber || macro.data.enterMonth,
                Weight: macro.data.weight + 'lbs',
                TDEE: macro.data.tdee,
                DeficitSurplus: macro.data.deficitSurplus + '%',
                Protein: macro.data.proteinCalories + ' calories',
                Fats: macro.data.fatsCalories + ' calories',
                Carbs: macro.data.carbsCalories + ' calories'
            })
        })
        return dataSet;
    }

    function addEventListener() {
        $('#trackMacros__modal').on('show.bs.modal', function (event) {
            renderFormioForm();
            console.log('render formio');
          })
    }

    function init() {
        addEventListener();
        getFormioData(formioURL + '/submission')
        .then(function(submission) {
            renderDataTable(submission);
        })
    }
    //value = (data.tdee - (data.tdee * (data.deficitSurplus/100))) - (((data.weight / 2.2) * data.protein * 4) + ((data.weight / 2.2) * data.fats * 4));
    $(document).ready(function() {
        init();
    })
})(jQuery);