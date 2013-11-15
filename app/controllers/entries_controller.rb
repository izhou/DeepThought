class EntriesController < ApplicationController
  respond_to :json, :html

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
    @entry = Entry.create!(params[:entry])
    render json: @entry
  end

  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy
    render json: @entry
  end
end
