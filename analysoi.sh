#!/bin/bash

echo "Repository analysis started"

echo "Detected languages:" | tee analysis_report.txt

find . -type f -name "*.py" | grep -q . && echo "- Python" | tee -a analysis_report.txt
find . -type f -name "*.js" | grep -q . && echo "- JavaScript" | tee -a analysis_report.txt
find . -type f -name "*.ts" | grep -q . && echo "- TypeScript" | tee -a analysis_report.txt
find . -type f -name "*.java" | grep -q . && echo "- Java" | tee -a analysis_report.txt
find . -type f -name "*.html" | grep -q . && echo "- HTML" | tee -a analysis_report.txt
find . -type f -name "*.css" | grep -q . && echo "- CSS" | tee -a analysis_report.txt

echo "" | tee -a analysis_report.txt
echo "Design patterns detected:" | tee -a analysis_report.txt

grep -R "getInstance" -n . && echo "- Singleton" | tee -a analysis_report.txt
grep -R "create[A-Z]" -n . && echo "- Factory Method" | tee -a analysis_report.txt
grep -R "notify" -n . && echo "- Observer" | tee -a analysis_report.txt
grep -R "Strategy" -n . && echo "- Strategy" | tee -a analysis_report.txt
grep -R "Decorator" -n . && echo "- Decorator" | tee -a analysis_report.txt

echo "Analysis ready"
