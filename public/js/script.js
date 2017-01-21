$(window).load(function(){
    // do something 
    var data = $.parseJSON($("#jsonAnswer").html());
    var coverage = new Coverage(data);

    buildCoverageHTML = function(coverage) {
    $(".coverage-section").remove();

    var plugin = new CoveragePlugin(coverage);

    // Adds the demographic section
    plugin.addEligibleMetadataSection();
    plugin.addDemographicsSection();
    plugin.addInsuranceSection1();
    plugin.addInsuranceSection2();
    plugin.addInsuranceSection3();
    plugin.addPlanMaximumMinimumDeductibles();
    plugin.addPlanCoinsurance();
    plugin.addPlanCopayment();
    plugin.addPlanDisclaimer();
    plugin.addAdditionalInsurancePolicies();
    plugin.addGenericServices();


    $('#eligibleContent').append(plugin.coverageSection);
    };

    buildCoverageHTML(coverage);
});
