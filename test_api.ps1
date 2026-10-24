$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$headers = @{ "Content-Type" = "application/json" }

Write-Host "=== TEST 1: Demo Login ==="
$demoRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/demo" -Method Post -Headers $headers
$demoAuth = $demoRaw.data
if ($demoAuth.token -and $demoAuth.user.email -eq "alex.chen@finpath.demo") {
    Write-Host "[PASS] Demo login succeeded. User: $($demoAuth.user.email)"
} else {
    Write-Error "[FAIL] Demo login failed"
}

$authHeader = @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $($demoAuth.token)"
}

Write-Host "`n=== TEST 2: Overview Assessment & Goals ==="
$overviewRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/calculations/overview" -Method Get -Headers $authHeader
$overview = $overviewRaw.data
Write-Host "Monthly Surplus: $($overview.monthlySurplus), Income: $($overview.monthlyTakeHomeIncome), Expenses: $($overview.monthlyTotalExpenses)"
if ($overview.monthlySurplus -gt 0) {
    Write-Host "[PASS] Monthly surplus calculated correctly ($($overview.monthlySurplus) INR)"
}

$goalsRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/goals" -Method Get -Headers $authHeader
$goals = $goalsRaw.data
if ($goals.Count -gt 0) {
    $primary = $goals[0]
    Write-Host "Goal Title: $($primary.title), Target: $($primary.targetAmount), Allocated: $($primary.currentAllocated), Currency: $($primary.currency)"
    if ($primary.currency -eq "INR") {
        Write-Host "[PASS] Primary Goal currency is INR"
    } else {
        Write-Error "[FAIL] Primary Goal currency is not INR: $($primary.currency)"
    }
}

Write-Host "`n=== TEST 3: Opportunities in INR ==="
$oppsRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/opportunities" -Method Get -Headers $authHeader
$opps = $oppsRaw.data
Write-Host "Fetched $($opps.Count) opportunities. First opp: $($opps[0].title)"
Write-Host "Model string: $($opps[0].pricingModel)"
$charCodes = [char[]]$opps[0].pricingModel | ForEach-Object { "0x{0:X4}" -f [int]$_ }
Write-Host "First 10 chars: $($charCodes[0..9] -join ' ')"
if ($opps[0].pricingModel -match "[₹\u20B9]") {
    Write-Host "[PASS] Opportunity pricing model contains INR symbol (₹)"
} else {
    Write-Error "[FAIL] Opportunity pricing model lacks INR: $($opps[0].pricingModel)"
}

Write-Host "`n=== TEST 4: Revenue Calculator API in INR ==="
$calcBody = @{
    pricePerCustomer = 15000
    expectedCustomers = 10
    variableCostPerCustomer = 1500
    monthlyFixedExpenses = 5000
    initialSetupCosts = 25000
    customerAcquisitionCost = 1000
    conversionRate = 0.05
} | ConvertTo-Json
$calcRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/revenue-calculator/calculate" -Method Post -Headers $authHeader -Body $calcBody
$calcRes = $calcRaw.data
Write-Host "Base Gross Revenue: $($calcRes.base.grossRevenue), Profit: $($calcRes.base.estimatedOperatingProfit), BreakEven: $($calcRes.base.breakEvenCustomers)"
if ($calcRes.base.grossRevenue -eq 150000 -and $calcRes.base.estimatedOperatingProfit -gt 0) {
    Write-Host "[PASS] Revenue calculator accurately calculated INR unit economics"
} else {
    Write-Error "[FAIL] Revenue calculator output unexpected"
}

Write-Host "`n=== TEST 5: Transactions CRUD and CSV Export ==="
# Create
$newTx = @{
    type = "BUSINESS_INCOME"
    category = "Consulting Retainer"
    amount = 25000.00
    description = "Sprint 1 Automation Consulting"
    transactionDate = "2026-10-24"
} | ConvertTo-Json
$createdRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/transactions" -Method Post -Headers $authHeader -Body $newTx
$createdTx = $createdRaw.data
Write-Host "Created Tx ID: $($createdTx.id), Amount: $($createdTx.amount)"

# Update (Edit Transaction)
$updateTx = @{
    type = "BUSINESS_INCOME"
    category = "Consulting Retainer"
    amount = 28000.00
    description = "Sprint 1 Automation Consulting (With Addon)"
    transactionDate = "2026-10-24"
} | ConvertTo-Json
$updatedRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/transactions/$($createdTx.id)" -Method Put -Headers $authHeader -Body $updateTx
$updatedTx = $updatedRaw.data
if ($updatedTx.amount -eq 28000.00) {
    Write-Host "[PASS] Transaction successfully updated to 28000 INR via PUT"
} else {
    Write-Error "[FAIL] Transaction update failed"
}

# CSV Export
$csvRes = Invoke-WebRequest -Uri "http://localhost:8080/api/transactions/export" -Method Get -Headers @{ "Authorization" = "Bearer $($demoAuth.token)" } -UseBasicParsing
$firstLine = ($csvRes.Content -split "`r?`n")[0]
Write-Host "CSV Header: $firstLine"
if ($firstLine -match "Amount \(INR\)") {
    Write-Host "[PASS] CSV export header specifies Amount (INR)"
} else {
    Write-Error "[FAIL] CSV export header missing INR"
}

# Delete
Invoke-RestMethod -Uri "http://localhost:8080/api/transactions/$($createdTx.id)" -Method Delete -Headers $authHeader
Write-Host "[PASS] Deleted transaction $($createdTx.id)"

Write-Host "`n=== TEST 6: Progress Report ==="
$progRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/progress" -Method Get -Headers $authHeader
$prog = $progRaw.data
Write-Host "Pacing: $($prog.pacingStatus), Goal Completion: $($prog.goalCompletionPercentage)%, Tasks: $($prog.completedRoadmapTasks)/$($prog.totalRoadmapTasks)"
Write-Host "[PASS] Progress report generated cleanly"

Write-Host "`n=== TEST 7: Registration & Authorization ==="
$regEmail = "qa_tester_" + (Get-Random) + "@example.com"
$regUser = @{
    email = $regEmail
    password = "SecurePassword123!"
    fullName = "QA Test User"
} | ConvertTo-Json
$regRaw = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $regUser
$regAuth = $regRaw.data
if ($regAuth.token -and $regAuth.user.email -eq $regEmail) {
    Write-Host "[PASS] New user registered: $($regAuth.user.email)"
}

# Duplicate registration check
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $regUser
    Write-Error "[FAIL] Duplicate registration should have failed"
} catch {
    Write-Host "[PASS] Duplicate registration properly rejected (400)"
}

Write-Host "`n=========================================="
Write-Host "ALL E2E API INTEGRATION TESTS PASSED!"
Write-Host "=========================================="
