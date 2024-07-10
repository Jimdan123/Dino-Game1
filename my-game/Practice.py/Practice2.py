import random
import matplotlib.pyplot as plt
import numpy as np
def predict(a,b,c,x):
    return a*x**2 + b*x + c 

def gd (x,y,a,b,c):
    da = -2*x**2*(y - (a*x**2 + b*x + c))
    db = -2*x*(y - (a*x**2 + b*x + c))
    dc = -2*(y - (a*x**2 + b*x + c))
    return da,db,dc
def generate_data(a,b,c):
    number_data = 100
    dataX = []
    dataY = []
    for i in range (number_data):
        x = random.randrange(0, 100)
        dataX.append(x)
        y = predict(a,b,c,x) + random.randrange(0,100)
        dataY.append(y)
    return dataX,dataY

def visualize(dataX, dataY, a,b,c):
    linex = [i for i in range(100)]
    liney = [predict(a, b, c, __x) for __x in linex]
    plt.plot(dataX, dataY, 'o')
    plt.plot(linex, liney)
    plt.show()

dataX, dataY = generate_data(1,2,1)
_a = random.random()
_b = random.random()
_c = random.random()
alpha = 0.0000000001

visualize(dataX,dataY,_a,_b,_c)
for _ in range(10):
    for i in range(len(dataX)):
        da,db,dc = gd(dataX[i],dataY[i],_a,_b,_c)
        _a -= alpha*da
        _b -= alpha*db
        _c -= alpha*dc
    visualize(dataX,dataY,_a,_b,_c)

