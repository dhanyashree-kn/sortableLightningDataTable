public with sharing class SortTableController {
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        
        return [Select Id, Name, CloseDate, Amount, StageName, AccountId, Account.Name 
                From Opportunity 
                Limit 10]; 
    } 
}
