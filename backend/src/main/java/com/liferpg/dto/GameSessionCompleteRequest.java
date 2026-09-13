package com.liferpg.dto;

public class GameSessionCompleteRequest {

    private String sessionId;
    private int score;
    private double accuracy;
    private int timeTakenSeconds;
    private int moves;
    private int combo;
    private int answersCorrect;
    private int answersWrong;
    private boolean isWon = true;

    public GameSessionCompleteRequest() {}

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public int getMoves() { return moves; }
    public void setMoves(int moves) { this.moves = moves; }

    public int getCombo() { return combo; }
    public void setCombo(int combo) { this.combo = combo; }

    public int getAnswersCorrect() { return answersCorrect; }
    public void setAnswersCorrect(int answersCorrect) { this.answersCorrect = answersCorrect; }

    public int getAnswersWrong() { return answersWrong; }
    public void setAnswersWrong(int answersWrong) { this.answersWrong = answersWrong; }

    public boolean isWon() { return isWon; }
    public void setWon(boolean won) { isWon = won; }
}
