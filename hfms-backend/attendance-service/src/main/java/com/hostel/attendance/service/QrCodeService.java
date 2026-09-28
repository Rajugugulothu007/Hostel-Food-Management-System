package com.hostel.attendance.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class QrCodeService {

    private static final int QR_SIZE = 300;

    /**
     * Generates a QR PNG with the given content.
     */
    public byte[] generateQrPng(String content) {
        try {
            QRCodeWriter writer = new QRCodeWriter();

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE, hints);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the content to embed in the QR.
     * Format: HFMS-STUDENT-{studentId}
     */
    public String buildStudentQrContent(Long studentId) {
        return "HFMS-STUDENT-" + studentId;
    }

    /**
     * Parses a QR content string back into a student ID.
     * Returns null if the format is invalid.
     */
    public Long parseStudentId(String qrContent) {
        if (qrContent == null || !qrContent.startsWith("HFMS-STUDENT-")) {
            return null;
        }
        try {
            return Long.parseLong(qrContent.substring("HFMS-STUDENT-".length()));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}