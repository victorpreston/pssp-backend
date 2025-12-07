# Test 1: Default response (with breakdown and insights, no AI)
Write-Host "Test 1: Default response with all data" -ForegroundColor Green
curl -X POST http://localhost:3000/api/readiness/calculate 
  -H "Content-Type: application/json" 
  -d '{
    "learner_id": "L001",
    "program": "TGP",
    "academics": 75,
    "career_skills": 65,
    "life_skills": 80
  }' | ConvertFrom-Json | ConvertTo-Json -Depth 10

Start-Sleep -Seconds 1

# Test 2: Filtered response (no breakdown)
Write-Host "
Test 2: Response without breakdown" -ForegroundColor Green
curl -X POST 'http://localhost:3000/api/readiness/calculate?include_breakdown=false' 
  -H "Content-Type: application/json" 
  -d '{
    "learner_id": "L001",
    "program": "TGP",
    "academics": 75,
    "career_skills": 65,
    "life_skills": 80
  }' | ConvertFrom-Json | ConvertTo-Json -Depth 10

Start-Sleep -Seconds 1

# Test 3: Minimal response (no breakdown, no insights)
Write-Host "
Test 3: Minimal response" -ForegroundColor Green
curl -X POST 'http://localhost:3000/api/readiness/calculate?include_breakdown=false&include_insights=false' 
  -H "Content-Type: application/json" 
  -d '{
    "learner_id": "L001",
    "program": "TGP",
    "academics": 75,
    "career_skills": 65,
    "life_skills": 80
  }' | ConvertFrom-Json | ConvertTo-Json -Depth 10

Start-Sleep -Seconds 1

# Test 4: Request with AI recommendations flag (placeholder)
Write-Host "
Test 4: Response with AI recommendations flag" -ForegroundColor Green
curl -X POST 'http://localhost:3000/api/readiness/calculate?include_ai_recommendations=true' 
  -H "Content-Type: application/json" 
  -d '{
    "learner_id": "L001",
    "program": "TGP",
    "academics": 75,
    "career_skills": 65,
    "life_skills": 80
  }' | ConvertFrom-Json | ConvertTo-Json -Depth 10
