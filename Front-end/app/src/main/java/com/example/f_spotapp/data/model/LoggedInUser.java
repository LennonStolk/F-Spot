package com.example.f_spotapp.data.model;

/**
 * Data class that captures user information for logged in users retrieved from LoginRepository
 */
public class LoggedInUser {

    private String displayName;
    private String password;

    public LoggedInUser(String displayName, String password) {
        this.displayName = displayName;
        this.password = password;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPassword() {
        return password;
    }
}