package com.pknu26.usedtrade.dto;

public class ResponseDto<T> {
    private String status;  // 예: "success" 또는 "fail"
    private String message; // 예: "조회 성공", "비밀번호가 틀렸습니다"
    private T data;         // 실제 프론트가 필요로 하는 데이터 (T 타입)

    // 생성자
    public ResponseDto(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getter (데이터를 가져올 때 필요)
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public T getData() { return data; }

    // Setter (데이터를 넣을 때 필요)
    public void setStatus(String status) { this.status = status; }
    public void setMessage(String message) { this.message = message; }
    public void setData(T data) { this.data = data; }
}