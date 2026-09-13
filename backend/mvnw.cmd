@REM ----------------------------------------------------------------------------
@REM Life RPG - Maven Wrapper Script
@REM ----------------------------------------------------------------------------
@echo off
set "MAVEN_EXE=C:\Users\karis\.m2\wrapper\dists\apache-maven-3.9.6-bin\3311e1d4\apache-maven-3.9.6\bin\mvn.cmd"
if exist "%MAVEN_EXE%" (
    "%MAVEN_EXE%" %*
) else (
    mvn %*
)