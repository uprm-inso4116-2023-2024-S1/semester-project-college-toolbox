# Use the official Go image as the base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /backend

# Copy the Go application source code into the container
COPY . .

# Set the working directory to the server entrypoint
WORKDIR /backend/go/src

# Build the Go application inside the container
RUN go build -o main

# Expose the port that your Gin application runs on
EXPOSE 8080

# Command to run your Go application
CMD ["./main"]