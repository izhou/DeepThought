class EntriesController < ApplicationController
  respond_to :json

  def index
    @roots = Entry.all
    render json: @roots
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  def update
    @entry = Entry.find(params[:id])
    @entry.update_attributes!(params[:entry])
    render json: @entry
  end

  def create
    @entry = Entry.new(params[:entry])
    @entry.save
    render json: @entry
  end

  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy
    render json: @entry
  end
end
