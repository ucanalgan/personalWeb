import yfinance as yf
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

ticker = "MIATK.IS"
stock_data = yf.Ticker(ticker)

def get_stock_data():
    data = stock_data.history(period="1mo", interval="5m")
    return data

def moving_averages(data):
    data['SMA'] = data['Close'].rolling(window=20).mean()
    data['EMA'] = data['Close'].ewm(span=20, adjust=False).mean()

def macd(data):
    short_window = 12
    long_window = 26
    signal_window = 9
    short_ema = data['Close'].ewm(span=short_window, adjust=False).mean()
    long_ema = data['Close'].ewm(span=long_window, adjust=False).mean()
    data['MACD'] = short_ema - long_ema
    data['MACD_Signal'] = data['MACD'].ewm(span=signal_window, adjust=False).mean()

def rsi(data, window=14):
    delta = data['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()
    rs = avg_gain / avg_loss
    data['RSI'] = 100 - (100 / (1 + rs))

def bollinger_bands(data, window=20):
    sma = data['Close'].rolling(window=window).mean()
    rolling_std = data['Close'].rolling(window=window).std()
    data['Bollinger_Upper'] = sma + (rolling_std * 2)
    data['Bollinger_Lower'] = sma - (rolling_std * 2)

def fibonacci_retracement(data):
    max_price = data['Close'].max()
    min_price = data['Close'].min()
    difference = max_price - min_price
    first_level = max_price - 0.236 * difference
    second_level = max_price - 0.382 * difference
    third_level = max_price - 0.618 * difference
    return first_level, second_level, third_level

def volume_analysis(data):
    data['Volume_MA'] = data['Volume'].rolling(window=20).mean()

def generate_labels(data):
    data['Signal'] = 0
    data.loc[data['RSI'] > 70, 'Signal'] = -1
    data.loc[data['RSI'] < 30, 'Signal'] = 1
    data.loc[data['Close'] > data['EMA'], 'Signal'] = 1
    data.loc[data['Close'] < data['SMA'], 'Signal'] = -1
    return data

def prepare_features(data):
    features = data[['Close', 'SMA', 'EMA', 'MACD', 'MACD_Signal', 'RSI', 'Bollinger_Upper', 'Bollinger_Lower']]
    return features

def train_model(data):
    data = generate_labels(data)
    features = prepare_features(data)
    labels = data['Signal']
    
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, shuffle=False)
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Doğruluğu: {accuracy * 100:.2f}%")

    return model

def make_prediction(data, model):
    features = prepare_features(data)
    prediction = model.predict(features.iloc[-1].values.reshape(1, -1))

    if prediction == 1:
        return "Satın Al"
    elif prediction == -1:
        return "Sat"
    else:
        return "Bekle"

def plot_data(data):
    plt.figure(figsize=(12, 8))

    plt.subplot(2, 2, 1)
    plt.plot(data.index, data['Close'], label='Kapanış Fiyatı')
    plt.plot(data.index, data['SMA'], label='SMA (20)', linestyle='--')
    plt.plot(data.index, data['EMA'], label='EMA (20)', linestyle='--')
    plt.title(f"{ticker} Hisse Senedi Kapanış Fiyatı ve Hareketli Ortalamalar")
    plt.legend()

    plt.subplot(2, 2, 2)
    plt.plot(data.index, data['MACD'], label='MACD')
    plt.plot(data.index, data['MACD_Signal'], label='MACD Sinyali', linestyle='--')
    plt.title("MACD ve MACD Sinyali")
    plt.legend()

    plt.subplot(2, 2, 3)
    plt.plot(data.index, data['RSI'], label='RSI', color='green')
    plt.axhline(70, color='red', linestyle='--', label="Aşırı Alım")
    plt.axhline(30, color='blue', linestyle='--', label="Aşırı Satım")
    plt.title("RSI (Bağıl Güç Endeksi)")
    plt.legend()

    plt.subplot(2, 2, 4)
    plt.plot(data.index, data['Close'], label='Kapanış Fiyatı')
    plt.plot(data.index, data['Bollinger_Upper'], label='Üst Bollinger Bandı', linestyle='--')
    plt.plot(data.index, data['Bollinger_Lower'], label='Alt Bollinger Bandı', linestyle='--')
    plt.title("Bollinger Bantları")
    plt.legend()

    plt.tight_layout()
    plt.show()

def start_real_time_analysis_with_ml():
    data = get_stock_data()

    moving_averages(data)
    macd(data)
    rsi(data)
    bollinger_bands(data)
    volume_analysis(data)

    model = train_model(data)

    while True:
        data = get_stock_data()
        
        moving_averages(data)
        macd(data)
        rsi(data)
        bollinger_bands(data)
        volume_analysis(data)

        data = generate_labels(data)
        
        action = make_prediction(data, model)

        print(f"Yapılacak İşlem: {action}")
        
        plot_data(data)
        
        print(f"Sonuçlar güncellendi: {data.index[-1]}")
        time.sleep(300)

start_real_time_analysis_with_ml()