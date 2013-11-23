class EntriesController < ApplicationController
  respond_to :json, :html

  def index
    @roots = Entry.where('user_id = ?', current_user.id)
    render json: @roots
  end

  def show
    @entry = Entry.find(params[:id])
    if @entry[:user_id] == current_user.id
      render json: @entry
    else
      render json:"Access Denied"
    end
  end

  def update
    @entry = Entry.find(params[:id])
    @entry.update_attributes!(params[:entry])
    render json: @entry
  end

  def create
    @entry = Entry.new(params[:entry])
    @entry[:user_id] = current_user.id
    @entry.save!()
    render json: @entry
  end

  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy
    render json: @entry
  end
end
